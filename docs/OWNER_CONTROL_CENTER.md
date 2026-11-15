# ATHR Owner Control Center API

## Edge Function: `athr-owner-overview`
- Requires a valid Supabase JWT (platform JWT verification plus an explicit `auth.getUser(token)` check).
- Checks `athr_private.staff_roles` on every request and permits only an active, non-revoked `owner` role.
- Returns aggregate counts only: account count, quality report totals/open counts, separate wellbeing request totals/open counts, and seven-day report volume.
- Does not select, return, search, or expose conversation transcripts, feedback descriptions, or wellbeing excerpts.
- Writes an audit event to `athr_private.admin_action_log` for every successful dashboard view.
- Uses the server-only `SUPABASE_SERVICE_ROLE_KEY`; never place this key in the frontend.

## Current bootstrap
The owner role is intentionally not assigned automatically. First create and verify the owner's account, then grant the role through a trusted service-side process after confirming the account UUID. Never use user-editable metadata or a client-side form to grant ownership.

## Frontend
The owner panel is hidden unless this endpoint returns an authorized owner response. Ordinary users receive no owner metrics.
