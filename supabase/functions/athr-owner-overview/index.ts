import { createClient } from "npm:@supabase/supabase-js@2.119.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://a01210597683m-hue.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Vary": "Origin",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") return json({ error: "method_not_allowed" }, 405);

  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return json({ error: "authentication_required" }, 401);

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return json({ error: "server_configuration_error" }, 500);

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: authData, error: authError } = await admin.auth.getUser(token);
  if (authError || !authData.user) return json({ error: "invalid_session" }, 401);

  const { data: role, error: roleError } = await admin
    .schema("athr_private")
    .from("staff_roles")
    .select("role")
    .eq("user_id", authData.user.id)
    .eq("is_active", true)
    .is("revoked_at", null)
    .maybeSingle();

  if (roleError) return json({ error: "authorization_check_failed" }, 500);
  if (!role || role.role !== "owner") return json({ error: "owner_access_required" }, 403);

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [accounts, reports, openReports, wellbeing, openWellbeing, recentReports, recentWellbeing] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("quality_feedback").select("id", { count: "exact", head: true }),
    admin.from("quality_feedback").select("id", { count: "exact", head: true }).in("status", ["received", "triaged"]),
    admin.from("wellbeing_review_requests").select("id", { count: "exact", head: true }),
    admin.from("wellbeing_review_requests").select("id", { count: "exact", head: true }).in("status", ["received", "triaged"]),
    admin.from("quality_feedback").select("id", { count: "exact", head: true }).gte("created_at", since),
    admin.from("wellbeing_review_requests").select("id", { count: "exact", head: true }).gte("created_at", since),
  ]);

  const failed = [accounts, reports, openReports, wellbeing, openWellbeing, recentReports, recentWellbeing].find((r) => r.error);
  if (failed) return json({ error: "metrics_unavailable" }, 500);

  const { error: auditError } = await admin.schema("athr_private").from("admin_action_log").insert({
    actor_user_id: authData.user.id,
    action: "owner_dashboard_viewed",
    target_type: "aggregate_dashboard",
    metadata: { includes_private_conversation_content: false },
  });
  if (auditError) return json({ error: "audit_log_failed" }, 500);

  return json({
    role: "owner",
    generated_at: new Date().toISOString(),
    privacy: { raw_conversations_exposed: false, wellbeing_content_exposed: false },
    metrics: {
      accounts: accounts.count ?? 0,
      quality_reports_total: reports.count ?? 0,
      quality_reports_open: openReports.count ?? 0,
      wellbeing_requests_total: wellbeing.count ?? 0,
      wellbeing_requests_open: openWellbeing.count ?? 0,
      reports_last_7_days: (recentReports.count ?? 0) + (recentWellbeing.count ?? 0),
    },
  });
});
