
export async function verifyAnswer(payload: {
  token?: string;
  gameId: string;
  step: number;
  targetId: string;
  targetTitle: string;
  answer: string;
  timeSec: number;
}) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-answer`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(payload.token ? { Authorization: `Bearer ${payload.token}` } : {})
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
