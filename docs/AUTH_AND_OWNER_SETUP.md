# ATHR — Authentication and Owner Bootstrap Checklist

## Supabase Auth configuration (manual dashboard step)
- [ ] Confirm email/password provider is enabled.
- [ ] Configure the production site URL and allowed redirect URLs after the deployment domain is selected.
- [ ] Confirm email verification is enabled for public sign-up.
- [ ] Configure password reset and recovery email templates.
- [ ] Add a support/privacy contact address before public release.
- [ ] Test sign-up, email confirmation, sign-in, sign-out, and password recovery on Android Chrome.

## First owner account
1. The project owner creates an account through the ATHR sign-up screen using the email address they control.
2. Confirm the email address.
3. A trusted project operator verifies the account identity and grants the `owner` role in `athr_private.staff_roles` through a server-side/service-role-only process.
4. Never grant owner status through browser metadata, user-editable profile fields, or a public RPC.
5. Verify the owner role before enabling any owner dashboard endpoints.

## Security checks before enabling administration
- Owner dashboard endpoints must validate the authenticated user against `athr_private.staff_roles` on the server.
- Aggregate quality reports only; do not build unrestricted transcript browsing.
- Every human review must have a defined purpose, scoped case, approval, expiry, and access-log entry.
- Wellbeing review remains a separate user-initiated flow with explicit consent for the exact excerpt.
- Do not expose the Supabase service-role key in HTML, JavaScript, GitHub Pages, or mobile builds.

## Known status
The repository currently contains a static HTML prototype. Authentication and consent UI code is present, but end-to-end behavior is not yet verified against a real email account. The verified owner account currently has an active owner role, and owner-only endpoints have been exercised. This does not mean the app is production-ready; the model runtime, complete auth flows, security review, and end-to-end user tests remain outstanding.
