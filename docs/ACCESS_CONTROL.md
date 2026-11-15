# ATHR — Ownership, Access, Privacy, and Quality Review

## Product-owner control
The project owner retains administrative control through the Supabase organization and project dashboard: database schema, Auth configuration, storage, API keys, deployments, logs, backups, and project membership. The owner-facing ATHR dashboard must expose operational settings without granting routine access to private conversation content.

## End-user data ownership
- Each signed-in user can access and manage only rows associated with their own auth user ID.
- Every exposed public table has Row Level Security enabled.
- RLS policies bind access to auth.uid(); client-provided user IDs cannot grant access to another account.
- Users can manage their own profile, preferences, learning preferences, projects, conversations, messages, and wellbeing preferences.
- Provide clear controls to export and delete account data, subject to applicable legal and safety retention requirements.

## Signup notice and explicit consent
- During registration, clearly explain in plain language what data is collected, why it is processed, how long it is retained, who may access it, and how to change privacy choices.
- Obtain explicit, affirmative consent for optional use of eligible conversations to improve ATHR AI quality/models. Do not bundle this optional consent with acceptance of essential Terms or Privacy Policy.
- Users must be able to change the model-improvement choice later in account privacy settings. The choice applies prospectively to new eligible content; explain any limits for data already processed.
- Essential safety, security, abuse-prevention, support, and legal processing is separate from optional model-improvement consent and must be described separately.
- Do not promise that no human can ever access content. Explain that a limited number of authorized, trained personnel or bound service providers may access specific content only when necessary for a defined purpose, under need-to-know access controls and logging.

## Human access — defined purposes only
Limited authorized human access may occur only as necessary for:
1. Investigating abuse, serious safety concerns, or security incidents.
2. Providing user-requested support or troubleshooting a product issue.
3. Handling legal obligations or valid legal requests.
4. Improving model performance only when the user’s applicable data-control setting permits it.

Controls:
- Role-based access, least privilege, need-to-know approvals, time-limited access where technically possible, and immutable access logs.
- Staff and service providers must be contractually bound to confidentiality and receive privacy/security training.
- Minimize the content exposed; remove or mask direct identifiers when feasible.
- Prohibit casual browsing, bulk browsing, curiosity access, and use of conversation content for marketing or advertising.
- Define retention periods and deletion workflows; do not retain review copies indefinitely.

## Owner quality dashboard
The owner dashboard provides aggregate and de-identified operational quality reports by default, including:
- error rates, latency, availability, and model/provider failures
- language and translation quality metrics
- user feedback counts and issue categories
- safety incident counts and resolution status
- anonymized trends and release comparisons

The owner dashboard must not provide a general-purpose transcript browser or unrestricted search over private conversations. Users may voluntarily submit a specific conversation excerpt or report for support/quality review with a clear explanation of what will be shared and with whom.

## Separate wellbeing review system
- Wellbeing-assistant conversations are excluded from ordinary human quality review and general owner reports by default.
- Any exceptional review pathway for wellbeing content must be separate, narrowly scoped, justified by a defined safety/support purpose, and governed by a separate explicit notice/consent where appropriate and applicable law.
- Do not use wellbeing conversations for general model improvement by default.
- Do not expose wellbeing conversation text in the owner dashboard.
- The wellbeing assistant is AI support, not a replacement for licensed professional care. Avoid collecting clinical notes or sensitive health data unless a separately reviewed, compliant design is approved.

## Administrative role safety
- Never store administrator privileges in user-editable user_metadata.
- Any future in-app owner/admin role must be granted only by a trusted server-side process using protected app_metadata or a private authorization table.
- Never ship Supabase service-role/secret keys in browser or mobile application code.
- The initial database foundation intentionally does not expose a client-editable admin flag or a public "manage all users" policy.

## Current implementation and verification
- Seven public tables created.
- RLS enabled on all seven.
- Auth user trigger creates a profile and default preferences.
- Direct RPC execution of the SECURITY DEFINER trigger function is revoked from public, anon, and authenticated roles.
- Supabase security and health advisors returned no findings after the hardening migration.

## Not yet implemented
- Signup privacy notice and separate affirmative model-improvement consent.
- User-facing data controls and privacy settings.
- Human review operations, staff roles, approvals, access logs, and retention automation.
- Owner quality dashboard with aggregate-only reporting.
- Separate wellbeing review workflow.
- End-to-end sign-up/sign-in and RLS tests with real test accounts.
- In-app account export/deletion workflow.
- Owner-only in-app administration panel.
- Storage buckets and private file policies.
- Auth provider, redirect URL, email confirmation, and recovery configuration.

## Product policy note
These are ATHR's selected product requirements inspired by privacy controls and limited human-access practices described by OpenAI. ATHR is a separate service and must publish its own accurate Privacy Policy, consent flows, retention schedule, and operational controls. Do not claim ATHR follows OpenAI's internal procedures or has equivalent safeguards until independently implemented and verified.


## Implemented privacy and quality schema (2026-11-15)
- `public.privacy_settings`: per-user optional model-improvement and separate wellbeing-review switches; both default to false.
- `public.privacy_consent_events`: versioned consent/decline/withdrawal event history, visible only to the owning user through RLS.
- `public.quality_feedback`: user-submitted issue reports; an excerpt is included only when the user chooses to share it.
- `public.wellbeing_review_requests`: a separate user-initiated review request table; explicit separate consent is required by a database constraint.
- `athr_private.quality_metrics_daily`: private operational metrics table.
- `athr_private.human_review_access_log`: private log for authorized review access events.
- New-account trigger now creates a default privacy-settings row with optional processing disabled.
- RLS is enabled on all new public tables. Private operational tables are in a non-exposed schema and restricted to the service role.
- Security Advisor returned no findings after this schema update.

## Important implementation boundary
The schema is a foundation, not a complete operational review system. No staff console, reviewer identity/approval workflow, automated retention/deletion job, model-training pipeline, signup consent screen, or owner dashboard is live yet. Do not process or expose conversation transcripts for model improvement until the corresponding consent enforcement and backend workflow are implemented and tested.


## Authentication UI and consent workflow (prototype)
- The static prototype now includes email/password sign-up and sign-in using the browser-safe Supabase publishable key.
- Sign-up requires acknowledgement of the privacy notice and terms; optional model-improvement consent is a separate unchecked box.
- The auth-user trigger records the signup notice/terms acknowledgement and the optional model-improvement decision even when email confirmation means no immediate browser session.
- Model-improvement preference changes use the authenticated `set_model_improvement_preference` database function, which updates the preference and writes a consent-history event atomically.
- The direct user UPDATE policy on `privacy_settings` has been removed; users can read and create their row, and use the audited function to change model-improvement preference.
- Users can submit a quality report and optionally include a specific excerpt they explicitly choose to share.
- Wellbeing review is a separate user-initiated request requiring separate explicit consent for the exact excerpt.
- Private staff roles and admin-action audit tables exist in `athr_private`; no owner role has been assigned yet.

## Current limitations
- Browser sign-up and consent code has been committed but not tested with a real verified email account.
- Auth provider, email confirmation, redirect URLs, recovery emails, and production templates require dashboard configuration and testing.
- No model-improvement pipeline or human reviewer console is active.
- No owner dashboard or staff approval workflow is active.
- Retention periods, automatic deletion, export/delete account workflows, and privacy contact details remain outstanding.
