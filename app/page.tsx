
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { verifyAnswer } from './lib/api';

type Target = { id: string; title: string };

export default function Page(): JSX.Element {
  const [gameId] = useState(() => uuid());
  const [step, setStep] = useState(1);
  const [target, setTarget] = useState<Target>({ id: '<SET_AFTER_SEED>', title: 'کاغذ' });
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [chain, setChain] = useState(0);
  const [lastStats, setLastStats] = useState<{ uses: number; total: number } | null>(null);
  const t0 = useRef<number>(0);

  useEffect(() => { t0.current = performance.now(); }, [step]);

  async function submit() {
    const timeSec = (performance.now() - t0.current) / 1000;
    const res = await verifyAnswer({ gameId, step, targetId: target.id, targetTitle: target.title, answer, timeSec });
    if (res.valid) {
      setScore((s) => s + res.stepScore);
      setChain((s) => s + 1);
      setLastStats(res.stats);
      // MVP: هدف بعدی همان پاسخ کاربر است تا حلقه ادامه یابد.
      setTarget({ id: target.id, title: answer });
      setAnswer('');
      setStep((s) => s + 1);
    } else {
      alert(`Game Over — Reason: ${res.reason}`);
      setAnswer('');
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">۲۰ سؤال نابودگری</h1>
      <div className="p-4 rounded-xl border">
        <div className="text-sm opacity-80">هدف:</div>
        <div className="text-xl">{target.title}</div>
      </div>
      <div className="flex gap-2">
        <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="با چی نابود میشه؟" className="flex-1 border rounded-xl p-3" />
        <button onClick={submit} className="px-4 py-3 rounded-xl bg-black text-white">ارسال</button>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div>امتیاز: <b>{score}</b></div>
        <div>زنجیره: <b>{chain}</b></div>
        {lastStats && <div>این کلمه تا حالا {lastStats.uses} بار از {lastStats.total} استفاده شده</div>}
      </div>
    </main>
  );
}
