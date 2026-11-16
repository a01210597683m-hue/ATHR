-- ATHR private voice notes v1
-- Audio objects remain in the existing private bucket and are scoped to the authenticated owner.

update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array[
      'image/jpeg','image/png','image/webp','image/gif',
      'audio/webm','audio/mp4','audio/ogg','audio/mpeg','audio/aac','audio/wav'
    ]
where id = 'athr-assets';

create table public.message_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket_id text not null default 'athr-assets' references storage.buckets(id) on delete cascade,
  object_path text not null unique,
  mime_type text not null check (mime_type in ('audio/webm','audio/mp4','audio/ogg','audio/mpeg','audio/aac','audio/wav')),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  duration_seconds integer not null check (duration_seconds between 1 and 180),
  created_at timestamptz not null default now(),
  constraint message_attachments_owner_path check (split_part(object_path,'/',1) = user_id::text)
);

create index message_attachments_conversation_idx
  on public.message_attachments(conversation_id, created_at);

alter table public.message_attachments enable row level security;

create policy "Users read their own message attachments"
on public.message_attachments for select to authenticated
using (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.messages m
    where m.id = message_id and m.user_id = (select auth.uid())
      and m.conversation_id = message_attachments.conversation_id
  )
);

create policy "Users add their own message attachments"
on public.message_attachments for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.messages m
    where m.id = message_id and m.user_id = (select auth.uid())
      and m.conversation_id = message_attachments.conversation_id
  )
);

create policy "Users delete their own message attachments"
on public.message_attachments for delete to authenticated
using (user_id = (select auth.uid()));

create policy "Users upload private ATHR audio objects"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'athr-assets'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and lower(storage.extension(name)) in ('webm','m4a','ogg','mp3','aac','wav')
);

create policy "Users read private ATHR audio objects"
on storage.objects for select to authenticated
using (
  bucket_id = 'athr-assets'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Users delete private ATHR audio objects"
on storage.objects for delete to authenticated
using (
  bucket_id = 'athr-assets'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
