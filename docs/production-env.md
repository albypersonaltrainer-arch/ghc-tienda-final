# Production environment variables

Required for production checkout:

- `SUMUP_API_KEY`
- `SUMUP_MERCHANT_CODE`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL=https://www.ghcnutrition.com` (recommended)

Secrets must be configured in Vercel and never committed to the repository.
After adding or rotating production environment variables, trigger a new production deployment so the runtime picks up the new values.
