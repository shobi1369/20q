
// Utility helpers (isolated for testing)
export function normalizeFa(s: string): string {
  return s
    .trim()
    .replace(/\u064A/g, 'ی')   // ي -> ی
    .replace(/\u0643/g, 'ک')   // ك -> ک
    .replace(/[\u200c\u200f]/g, '') // strip ZWNJ / RTL marks
    .replace(/\s+/g, ' ');
}
export function rarityScore(p: number): number {
  return -Math.log10(Math.max(p, 1e-6));
}
export function chainMul(step: number): number { return Math.pow(1.12, step - 1); }
export function speedMul(seconds: number): number { return 1 + Math.min(0.25, Math.max(0, (5 - seconds) * 0.05)); }
