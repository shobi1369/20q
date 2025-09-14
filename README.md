
# 20Q Destroyer — MVP (Fixed)

## Run
1) `npm i`
2) `.env.local` را از روی `.env.local.example` بسازید.
3) Migration/Seed را اعمال کنید (داشبورد Supabase یا `supabase db reset`).
4) تابع را محلی اجرا: `npm run supabase:serve`
5) اپ را اجرا: `npm run dev`

## Deploy (Edge Functions)
Push روی `main` → GitHub Actions تابع `verify-answer` را دیپلوی می‌کند.

## Test (Deno)
به پوشه `supabase/functions/verify-answer` بروید و اجرا کنید:
`deno test --allow-all`
