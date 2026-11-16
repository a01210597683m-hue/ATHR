import { createClient } from "npm:@supabase/supabase-js@2.119.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://a01210597683m-hue.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
});
const prompts: Record<string, string> = {
  central: "أنت المساعد المركزي في ATHR. ساعد المستخدم بالعربية الواضحة أو بلغته، وكن دقيقًا وعمليًا. لا تدّع تنفيذ أفعال لم تنفذها، واذكر حدود معرفتك عند الحاجة.",
  learning: "أنت عقل التعلّم في ATHR. اشرح تدريجيًا، اختبر الفهم بأسئلة قصيرة، وكيّف الشرح مع مستوى المتعلم. لا تختلق مصادر.",
  languages: "أنت مدرّب لغات ATHR الشخصي. أدر محادثة حقيقية ودافئة باللغة المستهدفة، وكيّف طول الجمل والمفردات مع مستوى المتعلم. لا تحوّل كل رد إلى درس نظري. شجّع المتعلم على الرد، وصحّح الأخطاء المهمة بلطف مع عرض الصياغة الصحيحة وسبب مختصر ومثال طبيعي. إذا أرسل المتعلم جملة صحيحة فلا تخترع خطأ. استخدم العربية لشرح التصحيح عند الحاجة، ثم ارجع للمحادثة باللغة المستهدفة. في تمثيل الأدوار التزم بالشخصية والموقف، واسأل سؤالًا واحدًا في كل مرة. لا تدّع تقييم النطق من النص وحده؛ يمكن تقديم ملاحظات نطق عامة فقط.",
  creative: "أنت عقل الإبداع في ATHR. ساعد في توليد الأفكار وتطويرها إلى مخرجات عملية، مع احترام طلبات المستخدم وحقوق الملكية.",
  wellbeing: "أنت مساعد رفاه عام في ATHR. كن داعمًا وغير حُكمي، وقدّم معلومات عامة وتمارين بسيطة فقط. لا تشخّص ولا تستبدل المختصين، وتعامل مع الخطر العاجل بجدية.",
  projects: "أنت عقل المشروعات في ATHR. حوّل الأهداف إلى نطاق ومراحل ومهام ومخاطر ومؤشرات تقدم قابلة للقياس.",
  research: "أنت عقل البحث والتحليل في ATHR. ميّز الحقائق عن الافتراضات، واذكر عدم اليقين، ولا تختلق مراجع أو بيانات.",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const origin = req.headers.get("Origin");
  if (origin && origin !== "https://a01210597683m-hue.github.io") return json({ error: "origin_not_allowed" }, 403);

  const auth = req.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return json({ error: "authentication_required" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  let supabaseKey = Deno.env.get("SUPABASE_SECRET_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!supabaseKey) {
    try { const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}"); supabaseKey = keys.default || Object.values(keys)[0] || ""; } catch { /* missing secret */ }
  }
  if (!supabaseUrl || !supabaseKey) return json({ error: "server_configuration_error" }, 500);

  const db = createClient(supabaseUrl, supabaseKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: authData, error: authError } = await db.auth.getUser(token);
  if (authError || !authData.user) return json({ error: "invalid_session" }, 401);
  const userId = authData.user.id;

  const contentType = req.headers.get("Content-Type") || "";
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) return json({ error: "content_type_invalid" }, 415);
  const declaredLength = Number(req.headers.get("Content-Length") || 0);
  if (Number.isFinite(declaredLength) && declaredLength > 65536) return json({ error: "request_too_large" }, 413);
  let rawBody = "";
  try { rawBody = await req.text(); } catch { return json({ error: "invalid_body" }, 400); }
  if (new TextEncoder().encode(rawBody).byteLength > 65536) return json({ error: "request_too_large" }, 413);
  let body: any;
  try { body = JSON.parse(rawBody); } catch { return json({ error: "invalid_json" }, 400); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "request_body_invalid" }, 400);
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const brainKey = typeof body.brain_key === "string" ? body.brain_key : "central";
  const conversationId = typeof body.conversation_id === "string" ? body.conversation_id : "";
  const tutor = body.tutor && typeof body.tutor === "object" ? body.tutor : {};
  const targetLanguage = typeof tutor.target_language === "string" && ["en","fr","es","de","ja","it"].includes(tutor.target_language) ? tutor.target_language : "en";
  const tutorLevel = typeof tutor.level === "string" && ["beginner","elementary","intermediate","advanced"].includes(tutor.level) ? tutor.level : "intermediate";
  const tutorMode = typeof tutor.mode === "string" && ["conversation","roleplay","correction"].includes(tutor.mode) ? tutor.mode : "conversation";
  const languageNames: Record<string,string> = {en:"English",fr:"French",es:"Spanish",de:"German",ja:"Japanese",it:"Italian"};
  const tutorInstruction = brainKey === "languages" ? `\n\nSession settings: target language=${languageNames[targetLanguage]}, learner level=${tutorLevel}, practice mode=${tutorMode}. Keep the conversation primarily in ${languageNames[targetLanguage]}. In roleplay mode, begin or continue a realistic scenario. In correction mode, prioritize correcting the learner language errors. Ask only one clear follow-up question at a time.` : "";
  if (!message || message.length > 6000) return json({ error: "message_length_invalid" }, 400);
  if (!Object.hasOwn(prompts, brainKey)) return json({ error: "unknown_brain" }, 400);

  const { data: brain, error: brainError } = await db.rpc("athr_get_specialist_brain_status", { p_brain_key: brainKey });
  if (brainError) return json({ error: "brain_registry_unavailable" }, 500);
  if (!brain || brain.error === "brain_not_found" || brain.status !== "enabled") return json({ error: "brain_not_enabled" }, 403);

  // ATHR calls only the inference endpoint configured by its owner. No third-party AI vendor is hard-coded.
  const inferenceUrl = Deno.env.get("ATHR_INFERENCE_URL") || "";
  const inferenceModel = Deno.env.get("ATHR_INFERENCE_MODEL") || "";
  const inferenceKey = Deno.env.get("ATHR_INFERENCE_API_KEY") || "";
  if (!inferenceUrl || !inferenceModel) return json({ error: "engine_not_configured" }, 503);
  let endpoint: URL;
  try {
    endpoint = new URL(inferenceUrl);
    if (endpoint.protocol !== "https:" || endpoint.username || endpoint.password) return json({ error: "inference_endpoint_invalid" }, 500);
  } catch { return json({ error: "inference_endpoint_invalid" }, 500); }

  // Tier-aware fair-use ceilings. Paid tiers only take effect after a server-verified entitlement update.
  const { data: entitlement, error: entitlementError } = await db.from("athr_user_entitlements")
    .select("plan_code,status").eq("user_id", userId).maybeSingle();
  if (entitlementError) return json({ error: "usage_check_failed" }, 500);
  const activePlan = entitlement?.status === "active" ? entitlement.plan_code : "free";
  const planLimits: Record<string, { hourly: number; daily: number }> = {
    free: { hourly: 30, daily: 240 },
    plus: { hourly: 100, daily: 800 },
    pro: { hourly: 200, daily: 2000 },
    business: { hourly: 300, daily: 4000 },
  };
  const limits = planLimits[activePlan] || planLimits.free;
  const hourSince = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const daySince = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [hourUsage, dayUsage] = await Promise.all([
    db.from("messages").select("id", { count: "exact", head: true })
      .eq("user_id", userId).eq("role", "user").gte("created_at", hourSince),
    db.from("messages").select("id", { count: "exact", head: true })
      .eq("user_id", userId).eq("role", "user").gte("created_at", daySince),
  ]);
  if (hourUsage.error || dayUsage.error) return json({ error: "usage_check_failed" }, 500);
  if ((hourUsage.count || 0) >= limits.hourly) return json({ error: "hourly_limit_reached" }, 429);
  if ((dayUsage.count || 0) >= limits.daily) return json({ error: "daily_limit_reached" }, 429);

  let conversation: any = null;
  if (conversationId) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(conversationId)) return json({ error: "invalid_conversation_id" }, 400);
    const { data, error } = await db.from("conversations").select("id,assistant_type").eq("id", conversationId).eq("user_id", userId).maybeSingle();
    if (error) return json({ error: "conversation_lookup_failed" }, 500);
    if (!data) return json({ error: "conversation_not_found" }, 404);
    if (data.assistant_type !== brainKey) return json({ error: "conversation_brain_mismatch" }, 409);
    conversation = data;
  }

  let history: any[] = [];
  if (conversation) {
    const { data, error } = await db.from("messages")
      .select("role,content").eq("conversation_id", conversation.id).eq("user_id", userId)
      .in("role", ["user", "assistant"]).order("created_at", { ascending: false }).limit(12);
    if (error) return json({ error: "history_unavailable" }, 500);
    history = data || [];
  }

  const orderedHistory = (history || []).reverse().map((m: any) => ({
    role: m.role, content: String(m.content).slice(0, 6000),
  }));
  orderedHistory.push({ role: "user", content: message });

  let aiResponse: Response;
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (inferenceKey) headers.Authorization = `Bearer ${inferenceKey}`;
    aiResponse = await fetch(endpoint.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: inferenceModel,
        messages: [{ role: "system", content: prompts[brainKey] + tutorInstruction }, ...orderedHistory],
        temperature: 0.7,
        max_tokens: 900,
        stream: false,
      }),
      signal: AbortSignal.timeout(60000),
    });
  } catch {
    return json({ error: "inference_unreachable", conversation_id: conversation?.id || null }, 502);
  }
  if (!aiResponse.ok) {
    if (aiResponse.status === 401 || aiResponse.status === 403) return json({ error: "inference_auth_failed" }, 502);
    if (aiResponse.status === 429) return json({ error: "inference_rate_limited" }, 503);
    return json({ error: "inference_provider_error", provider_status: aiResponse.status }, 502);
  }

  let payload: any;
  try { payload = await aiResponse.json(); } catch { return json({ error: "inference_invalid_response" }, 502); }
  const rawContent = payload?.choices?.[0]?.message?.content;
  const answer = typeof rawContent === "string"
    ? rawContent.trim()
    : Array.isArray(rawContent)
      ? rawContent.map((part: any) => typeof part?.text === "string" ? part.text : "").join("\n").trim()
      : "";
  if (!answer) return json({ error: "empty_ai_response", conversation_id: conversation?.id || null }, 502);

  // Persist only after inference returned a valid answer.
  const isNewConversation = !conversation;
  if (!conversation) {
    const { data, error } = await db.from("conversations").insert({
      user_id: userId, assistant_type: brainKey, interface_locale: "ar",
      title: message.slice(0, 72),
    }).select("id,assistant_type").single();
    if (error || !data) return json({ error: "conversation_create_failed" }, 500);
    conversation = data;
  }
  // Insert both sides in one database statement so a partial exchange is not saved.
  const { error: exchangeSaveError } = await db.from("messages").insert([
    { conversation_id: conversation.id, user_id: userId, role: "user", content: message },
    { conversation_id: conversation.id, user_id: userId, role: "assistant", content: answer },
  ]);
  if (exchangeSaveError) {
    if (isNewConversation) {
      await db.from("conversations").delete().eq("id", conversation.id).eq("user_id", userId);
    }
    return json({ error: "exchange_save_failed", conversation_id: isNewConversation ? null : conversation.id }, 500);
  }
  await db.from("conversations").update({ updated_at: new Date().toISOString() })
    .eq("id", conversation.id).eq("user_id", userId);

  return json({
    success: true, conversation_id: conversation.id, brain_key: brainKey,
    reply: answer, usage: payload.usage || null,
  });
});
