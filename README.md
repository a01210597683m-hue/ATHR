# ATHR
**Beyond Intelligence. Into Possibility.**

ATHR is an Arabic-first, multilingual AI ecosystem designed to help people think, learn, create, grow, and turn ideas into meaningful impact.

## Product principles
- Arabic and English are the two primary interface languages.
- Additional world languages are optional and extensible.
- Every language-learning experience includes clear Arabic support: always visible, tap-to-reveal, or hidden by choice.
- ATHR is an intelligent productivity and personal-development ecosystem — **not a gaming platform**.
- A living, cinematic interface must remain accessible, calm, readable, and purposeful.

## Initial experience
- Central AI assistant and specialized intelligence
- Learning & growth, including a multilingual language-learning center
- Creative studio and project workspace
- Personal wellbeing assistant
- Adaptive interactive worlds for exploration and learning

## Repository structure
- `index.html` — responsive animated visual prototype
- `docs/PRODUCT_FOUNDATION.md` — product scope and principles
- `docs/I18N_ARABIC_FIRST.md` — multilingual and Arabic translation requirements

## Current implementation status (2026-11-15)
- Animated Arabic-first HTML prototype remains the front-end entry point.
- Supabase project is active and connected through the browser-safe publishable key in the prototype.
- Email/password sign-up and sign-in UI has been added.
- Registration records privacy-notice and terms acknowledgement plus the optional model-improvement choice through the auth-user trigger, including when email confirmation is required.
- Signed-in users can change model-improvement preference, interface language, and Arabic translation display mode.
- Users can submit quality reports; transcript excerpts are shared only when explicitly entered and selected.
- Wellbeing review requests are a separate user-initiated flow requiring a separate explicit consent for the specific excerpt.
- Private operational schema includes quality metrics, human-review access logs, staff-role assignments, and admin-action audit records.
- Security Advisor currently reports no findings.

## Not yet production-ready
- The owner account has not yet been assigned a protected owner role.
- The owner/admin dashboard and reviewer console are not implemented.
- No human-review team workflow or model-training/improvement pipeline is active.
- Supabase Auth email confirmation, password recovery, allowed redirect URLs, and production email templates still need configuration and end-to-end testing.
- Data export/deletion, retention automation, storage policies, and legal review are outstanding.
- No live production deployment has been verified.

See `docs/PRIVACY_NOTICE_AR.md`, `docs/TERMS_OF_SERVICE_AR.md`, and `docs/ACCESS_CONTROL.md`.

## Brand
ATHR (أثر) — a lasting impact.
