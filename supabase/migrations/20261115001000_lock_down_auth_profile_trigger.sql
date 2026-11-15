-- Lock down the auth-user trigger function: it is invoked by the trigger,
-- never directly through the public PostgREST RPC surface.
revoke all on function public.handle_new_athr_user() from public;
revoke all on function public.handle_new_athr_user() from anon;
revoke all on function public.handle_new_athr_user() from authenticated;
