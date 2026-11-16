-- Index foreign-key columns on private voice-note metadata.
-- Applied to the live ATHR project as migration index_message_attachment_foreign_keys.

create index if not exists message_attachments_bucket_id_idx
  on public.message_attachments(bucket_id);

create index if not exists message_attachments_message_id_idx
  on public.message_attachments(message_id);

create index if not exists message_attachments_user_id_idx
  on public.message_attachments(user_id);
