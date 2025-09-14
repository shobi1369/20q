
// Deno Edge Function (Supabase)
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.3';
import { normalizeFa, rarityScore, chainMul, speedMul } from './util.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON = Deno.env.get('SUPABASE_ANON_KEY')!; // در تولید از Service Role محدود استفاده کنید
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}

Deno.serve(async (req) => {
  try {
    const { gameId, step, targetId, targetTitle, answer, timeSec } = await req.json();
    const ans = normalizeFa(String(answer || ''));
    if (!ans || ans.length < 2) return json({ ok: false, reason: 'EMPTY' }, 400);

    const supa = createClient(SUPABASE_URL, SUPABASE_ANON, { global: { headers: { Authorization: req.headers.get('Authorization') || '' } } });

    // 1) گراف دستی
    const { data: edgeHit, error: e1 } = await supa
      .from('edges')
      .select('id, reason')
      .eq('from_id', targetId)
      .eq('to_text', ans)
      .maybeSingle();
    if (e1) throw e1;

    let isValid = !!edgeHit;
    let reason = edgeHit?.reason || '';

    // 2) قواعد عمومی با کمک مدل
    if (!isValid) {
      const prompt = `ارزیابی ایمن: آیا «${ans}» می‌تواند «${targetTitle}» را غیرخطرناک/عمومی از بین ببرد؟ پاسخ فقط VALID_SAFE | INVALID | AMBIGUOUS.`;
      const resp = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      });
      const txt = resp.choices?.[0]?.message?.content?.trim() || '';
      if (txt.startsWith('VALID_SAFE')) { isValid = true; reason = 'طبق قاعدهٔ عمومی'; }
      else if (txt.startsWith('AMBIGUOUS')) { isValid = false; reason = 'ابهام/نیاز به بازبینی'; }
      else { isValid = false; reason = 'نامعتبر/غیرایمن'; }
    }

    // 3) امتیازدهی و ثبت
    if (isValid) {
      const { data: allStats } = await supa
        .from('answers_stats')
        .select('answer_norm, uses')
        .eq('target_id', targetId);
      const alpha = 1;
      const v = (allStats?.length || 0) || 1;
      const total = (allStats || []).reduce((s, r) => s + (r.uses || 0), 0);
      const rec = (allStats || []).find((r) => r.answer_norm === ans);
      const uses = rec?.uses || 0;
      const p = (uses + alpha) / (total + alpha * v);
      const stepScore = Math.round(100 * rarityScore(p) * chainMul(step) * speedMul(timeSec || 5));

      await supa.from('moves').insert({ game_id: gameId, step, target_id: targetId, answer_text: ans, is_valid: true, score: stepScore, time_ms: Math.round((timeSec || 0) * 1000) });
      await supa.from('answers_stats').upsert({ target_id: targetId, answer_norm: ans, uses: uses + 1, last_used_at: new Date().toISOString() }, { onConflict: 'target_id,answer_norm' });

      return json({ ok: true, valid: true, reason, stats: { uses: uses + 1, total: total + 1 }, stepScore });
    }

    await supa.from('moves').insert({ game_id: gameId, step, target_id: targetId, answer_text: ans, is_valid: false, score: 0, time_ms: Math.round((timeSec || 0) * 1000) });
    return json({ ok: true, valid: false, reason });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: String(err) }, 500);
  }
});
