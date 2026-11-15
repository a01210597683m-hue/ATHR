# ATHR — Ownership, Access, and User Control

## Project owner control
The project owner retains administrative control through the Supabase organization and project dashboard: database schema, Auth configuration, storage, API keys, deployments, logs, backups, and project membership. Keep the GitHub repository private and review collaborator access before granting it.

## End-user data ownership
- Each signed-in user can access and manage only rows associated with their own auth user ID.
- Every exposed public table has Row Level Security enabled.
- RLS policies bind access to auth.uid(); client-provided user IDs cannot grant access to another account.
- User preferences include interface language, target learning languages, Arabic translation display mode, and reduced-motion preference.
- Users can manage their own projects, conversations, messages, and wellbeing feature preferences.

## Administrative role safety
- Do not store administrator privileges in user-editable user_metadata.
- Any future in-app owner/admin role must be granted only by a trusted server-side process using protected app_metadata or a private authorization table.
- Never ship Supabase service-role/secret keys in browser or mobile application code.
- The initial database foundation intentionally does not expose a client-editable admin flag or a public "manage all users" policy.

## Privacy and wellbeing
- Wellbeing preferences are opt-in and separate from ordinary profile data.
- The initial schema does not store clinical notes, diagnoses, or medical records.
- The wellbeing assistant must be clearly described as AI support, not a replacement for licensed professional care.

## Current verification
- Seven public tables created.
- RLS enabled on all seven.
- Auth user trigger creates a profile and default preferences.
- Direct RPC execution of the SECURITY DEFINER trigger function is revoked from public, anon, and authenticated roles.
- Supabase security and health advisors returned no findings after the hardening migration.

## Not yet completed
- End-to-end sign-up/sign-in and RLS tests with a real test account.
- In-app account export/deletion workflow.
- Owner-only in-app administration panel.
- Storage buckets and private file policies.
- Auth provider, redirect URL, email confirmation, and recovery configuration.
