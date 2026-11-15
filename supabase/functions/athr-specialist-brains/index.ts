import { createClient } from "npm:@supabase/supabase-js@2.119.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://a01210597683m-hue.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Vary": "Origin",
};
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET" && req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return json({ error: "authentication_required" }, 401);

  const url = Deno.env.get("SUPABASE_URL");
  let secretKey = Deno.env.get("SUPABASE_SECRET_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!secretKey) {
    try {
      const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
      secretKey = keys.default || Object.values(keys)[0] || "";
    } catch { secretKey = ""; }
  }
  if (!url || !secretKey) return json({ error: "server_configuration_error" }, 500);
  const admin = createClient(url, secretKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  if (authError || !authData.user) return json({ error: "invalid_session" }, 401);
  const { data: role, error: roleError } = await admin.schema("athr_private").from("staff_roles")
    .select("role").eq("user_id", authData.user.id).eq("is_active", true).is("revoked_at", null).maybeSingle();
  if (roleError) return json({ error: "authorization_check_failed" }, 500);
  if (!role || role.role !== "owner") return json({ error: "owner_access_required" }, 403);

  if (req.method === "GET") {
    const { data, error } = await admin.schema("athr_private").from("specialist_brains")
      .select("brain_key,name_ar,name_en,description_ar,description_en,category,status,sort_order,updated_at")
      .order("sort_order", { ascending: true });
    if (error) return json({ error: "brains_unavailable" }, 500);
    const { error: auditError } = await admin.schema("athr_private").from("admin_action_log").insert({
      actor_user_id: authData.user.id, action: "specialist_brains_listed",
      target_type: "specialist_brain_registry", metadata: { count: data.length },
    });
    if (auditError) return json({ error: "audit_log_failed" }, 500);
    return json({ brains: data });
  }

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const key = typeof body.brain_key === "string" ? body.brain_key : "";
  const allowedStatuses = ["enabled", "disabled", "maintenance"];
  if (!/^[a-z][a-z0-9_]{1,47}$/.test(key) || !allowedStatuses.includes(body.status)) {
    return json({ error: "invalid_brain_or_status" }, 400);
  }
  if (key === "central" && body.status !== "enabled") {
    return json({ error: "central_brain_cannot_be_disabled" }, 400);
  }
  const { data: existing, error: findError } = await admin.schema("athr_private").from("specialist_brains")
    .select("brain_key,status").eq("brain_key", key).maybeSingle();
  if (findError || !existing) return json({ error: "brain_not_found" }, 404);
  const { error: updateError } = await admin.schema("athr_private").from("specialist_brains")
    .update({ status: body.status, updated_at: new Date().toISOString(), updated_by: authData.user.id })
    .eq("brain_key", key);
  if (updateError) return json({ error: "brain_update_failed" }, 500);
  const { error: auditError } = await admin.schema("athr_private").from("admin_action_log").insert({
    actor_user_id: authData.user.id, action: "specialist_brain_status_changed",
    target_type: "specialist_brain", metadata: { brain_key: key, previous_status: existing.status, new_status: body.status },
  });
  if (auditError) return json({ error: "audit_log_failed" }, 500);
  return json({ success: true, brain_key: key, status: body.status });
});
