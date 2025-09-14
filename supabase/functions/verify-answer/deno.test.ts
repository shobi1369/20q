
import { assert, assertEquals, assertGreaterOrEqual, assertLessOrEqual } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { normalizeFa, rarityScore, chainMul, speedMul } from "./util.ts";

Deno.test('normalizeFa replaces Arabic Yeh/Kaf, removes ZWNJ, trims', () => {
  const raw = '  كاكايي  ' + String.fromCharCode(0x200C) + '  ';
  const out = normalizeFa(raw);
  assert(out.includes('ک'));
  assert(!out.includes('\u200c'));
  assertEquals(out.trim(), out);
});

Deno.test('rarityScore monotonic: smaller p → larger score', () => {
  const a = rarityScore(0.5);
  const b = rarityScore(0.05);
  assert(a < b);
});

Deno.test('chainMul grows with step', () => {
  assert(chainMul(2) > chainMul(1));
});

Deno.test('speedMul bounds [1.0, 1.25]', () => {
  const fast = speedMul(0);
  const slow = speedMul(10);
  assertGreaterOrEqual(fast, slow);
  assertLessOrEqual(fast, 1.25);
  assertGreaterOrEqual(slow, 1.0);
});

// EXTRA: normalization idempotence
Deno.test('normalizeFa is idempotent', () => {
  const s = 'ی ک';
  assertEquals(normalizeFa(normalizeFa(s)), normalizeFa(s));
});
