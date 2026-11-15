-- ATHR foundation schema v1
-- User-owned data is protected with RLS. No client-controlled admin flag is created.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  interface_locale text not null default 'ar',
  learning_languages text[] not null default '{}',
  arabic_translation_mode text not null default 'always'
    check (arabic_translation_mode in ('always','on_demand','hidden')),
  reduced_motion boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.learning_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_locale text not null default 'ar',
  target_locale text not null,
  proficiency_level text check (proficiency_level in ('beginner','elementary','intermediate','upper_intermediate','advanced')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, target_locale)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'active' check (status in ('active','paused','completed','archived')),
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  assistant_type text not null default 'central',
  interface_locale text not null default 'ar',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  source_locale text,
  arabic_translation text,
  created_at timestamptz not null default now()
);

create table public.wellbeing_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default false,
  preferred_language text not null default 'ar',
  privacy_acknowledged_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_user_updated_idx on public.projects(user_id, updated_at desc);
create index conversations_user_updated_idx on public.conversations(user_id, updated_at desc);
create index messages_conversation_created_idx on public.messages(conversation_id, created_at);
create index messages_user_created_idx on public.messages(user_id, created_at desc);
create index learning_preferences_user_idx on public.learning_preferences(user_id);

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.learning_preferences enable row level security;
alter table public.projects enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.wellbeing_preferences enable row level security;

create policy "Users manage their own profile" on public.profiles
for all to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users manage their own preferences" on public.user_preferences
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage their own learning preferences" on public.learning_preferences
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage their own projects" on public.projects
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage their own conversations" on public.conversations
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage their own messages" on public.messages
for all to authenticated
using (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.user_id = (select auth.uid())
  )
)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.user_id = (select auth.uid())
  )
);

create policy "Users manage their own wellbeing preferences" on public.wellbeing_preferences
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create or replace function public.handle_new_athr_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'))
  on conflict (id) do nothing;

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_athr on auth.users;
create trigger on_auth_user_created_athr
after insert on auth.users
for each row execute function public.handle_new_athr_user();
