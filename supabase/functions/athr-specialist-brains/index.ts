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

  if (req.method === "GET") {
    const { data, error } = await admin.rpc("athr_owner_list_specialist_brains", {
      p_user_id: authData.user.id,
    });
    if (error) return json({ error: "brains_unavailable" }, 500);
    if (data?.error) return json({ error: data.error }, data.error === "owner_access_required" ? 403 : 500);
    if (!Array.isArray(data?.brains)) return json({ error: "brains_unavailable" }, 500);
    return json({ brains: data.brains });
  }

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const key = typeof body.brain_key === "string" ? body.brain_key : "";
  const allowedStatuses = ["enabled", "disabled", "maintenance"];
  if (!/^[a-z][a-z0-9_]{1,47}$/.test(key) || !allowedStatuses.includes(body.status)) {
    return json({ error: "invalid_brain_or_status" }, 400);
  }
  const { data, error } = await admin.rpc("athr_owner_set_specialist_brain_status", {
    p_user_id: authData.user.id,
    p_brain_key: key,
    p_status: body.status,
  });
  if (error) return json({ error: "brain_update_failed" }, 500);
  if (data?.error) {
    const code = data.error;
    const httpStatus = code === "owner_access_required" ? 403
      : code === "brain_not_found" ? 404 : 400;
    return json({ error: code }, httpStatus);
  }
  return json(data);
});
