# ATHR — Ownership, Access, Privacy, and Quality Review

**Last updated:** 2026-11-15  
**Status:** Prototype implementation; not production-ready.

## 1. Project-owner control
The project owner controls the Supabase organization/project and GitHub repository. The future owner dashboard may manage service configuration, roles, releases, aggregate quality reports, and operational settings. It must not provide unrestricted browsing or search over private conversations.

## 2. End-user data isolation
- Every exposed table in the `public` schema has Row Level Security enabled.
- User-owned rows are scoped to `auth.uid()`.
- Private operational tables are in the non-exposed `athr_private` schema and restricted to the `service_role`.
- Never place a Supabase service-role/secret key in browser code, mobile code, or the GitHub repository.

## 3. Signup notice and consent
- Registration requires acknowledgement of the privacy notice and terms.
- Optional model-improvement consent is a separate unchecked choice and is not required to create an account.
- The auth-user trigger records the signup notice/terms acknowledgement and the user's optional model-improvement decision, including when email confirmation means no immediate browser session.
- A user's later model-improvement preference changes are audited by a database trigger.
- Consent-history rows are readable by the owning user but cannot be inserted or rewritten directly by client users.
- A saved opt-in is not permission to process transcripts until the model-improvement pipeline, retention rules, reviewer controls, and consent enforcement are actually deployed.

## 4. Limited human access — service rules
Potentially permissible purposes, subject to a published privacy policy and applicable law:
1. Safety, abuse-prevention, or security investigations.
2. User-requested support or troubleshooting.
3. Valid legal obligations or requests.
4. Model improvement only when the user's applicable optional setting permits it.

Required controls before any human review is activated:
- Authorized, trained personnel and confidentiality obligations.
- Least-privilege role-based access and case-specific purpose.
- Approval and time-limited access where feasible.
- Minimum necessary content; remove direct identifiers when feasible.
- Access logs and regular audit.
- No casual browsing, bulk browsing, marketing use, or unrestricted owner access.

**Current state:** No human reviewer console or operational transcript-review workflow is active.

## 5. Owner quality reports
The intended owner dashboard is aggregate/de-identified by default: error rates, latency, availability, language/translation issues, feedback categories, and incident counts. It must not expose a general-purpose transcript browser.

## 6. User-submitted quality reports
- Signed-in users can submit a quality issue.
- An excerpt is shared only if the user explicitly selects the share option and enters the excerpt.
- Reports are isolated to their owner under RLS.
- The owner/reviewer workflow to triage these reports is not active yet.

## 7. Separate wellbeing review
- Wellbeing-assistant conversations are excluded from general human review and model improvement by default.
- A user may submit a specific excerpt through a separate request form with a separate explicit consent.
- The database requires the separate-consent flag for a wellbeing review request.
- No automated or staff-operated wellbeing review service is active.
- The wellbeing assistant is AI support, not a replacement for licensed professional care.

## 8. Database implementation currently present
Public tables (11): `profiles`, `user_preferences`, `learning_preferences`, `projects`, `conversations`, `messages`, `wellbeing_preferences`, `privacy_settings`, `privacy_consent_events`, `quality_feedback`, `wellbeing_review_requests`.

Private tables (4): `quality_metrics_daily`, `human_review_access_log`, `staff_roles`, `admin_action_log`.

RLS is enabled on all 15 tables. Private tables are accessible only through service-role backend operations. The initial security advisor check after the latest hardening returned no findings.

## 9. Authentication prototype
- The static HTML prototype contains email/password signup and sign-in using the browser-safe Supabase publishable key.
- Signup requires privacy/terms acknowledgement and offers a separate optional model-improvement checkbox.
- Users can update model-improvement preference, interface language, and Arabic translation mode.
- Users can submit a quality report and a separate wellbeing review request.
- Frontend JavaScript syntax was checked; duplicate HTML IDs were not found.
- **Real signup, email confirmation, login, RLS isolation, and form submissions have not yet been tested with a real account.**

## 10. Owner role and administration
- A private `staff_roles` table exists.
- No owner role has been assigned yet.
- Owner/admin permissions must be granted only by a trusted server-side/service-role process after verifying the owner's account.
- Never grant administrative rights through user-editable metadata or a public client-side field.
- The owner dashboard and reviewer console are not implemented.

## 11. Remaining launch requirements
- Configure and test email confirmation, password recovery, redirect URLs, and email templates in Supabase Auth.
- Create and verify the owner's first account, then grant the owner role through a trusted backend process.
- Implement the owner dashboard, reviewer approvals, and immutable/time-limited review access workflow.
- Implement data export/deletion and retention schedules/automation.
- Configure private storage and file policies if uploads are added.
- Add an official privacy/support contact and complete legal review.
- Test the full product on Android and desktop before public release.

## 12. Product policy note
ATHR is a separate service. These controls are ATHR's own product requirements, inspired by general privacy and limited-access practices; they are not a claim that ATHR duplicates OpenAI's internal procedures. Publish only protections that are implemented and verified.
