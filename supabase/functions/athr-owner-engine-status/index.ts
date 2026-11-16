import { createClient } from "npm:@supabase/supabase-js@2.119.0";
const cors={"Access-Control-Allow-Origin":"https://a01210597683m-hue.github.io","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"GET, POST, OPTIONS","Vary":"Origin"};
const json=(v:unknown,s=200)=>new Response(JSON.stringify(v),{status:s,headers:{...cors,"Content-Type":"application/json","Cache-Control":"no-store"}});
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="GET"&&req.method!=="POST")return json({error:"method_not_allowed"},405);
 const token=(req.headers.get("Authorization")||"").replace(/^Bearer\s+/,"");
 if(!token)return json({error:"authentication_required"},401);
 const url=Deno.env.get("SUPABASE_URL")||"";
 let key=Deno.env.get("SUPABASE_SECRET_KEY")||Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
 if(!key){try{const keys=JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}");key=keys.default||Object.values(keys)[0]||"";}catch{}}
 if(!url||!key)return json({error:"server_configuration_error"},500);
 const db=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
 const {data,error}=await db.auth.getUser(token);
 if(error||!data.user)return json({error:"invalid_session"},401);
 const {data:ownerAllowed,error:roleError}=await db.rpc("athr_owner_dashboard_access",{p_user_id:data.user.id});
 if(roleError)return json({error:"authorization_check_failed"},500);
 if(ownerAllowed!==true)return json({error:"owner_access_required"},403);
 const inferenceUrl=Deno.env.get("ATHR_INFERENCE_URL")||"";
 const inferenceModel=Deno.env.get("ATHR_INFERENCE_MODEL")||"";
 let endpointValid=false;
 try{const u=new URL(inferenceUrl);endpointValid=u.protocol==="https:"&&!u.username&&!u.password&&u.pathname.endsWith("/v1/chat/completions");}catch{}
 const configured=!!(endpointValid&&inferenceModel);
 if(req.method==="POST"){
  if(!configured)return json({error:"engine_not_configured"},409);
  const headers:Record<string,string>={"Content-Type":"application/json"};
  const apiKey=Deno.env.get("ATHR_INFERENCE_API_KEY")||"";
  if(apiKey)headers.Authorization="Bearer "+apiKey;
  let response:Response;
  try{
   response=await fetch(inferenceUrl,{method:"POST",headers,body:JSON.stringify({model:inferenceModel,messages:[{role:"user",content:"Reply with exactly: ATHR ENGINE OK"}],temperature:0,max_tokens:20,stream:false}),signal:AbortSignal.timeout(20000)});
  }catch{return json({error:"inference_unreachable"},502);}
  if(!response.ok)return json({error:"inference_test_failed",provider_status:response.status},502);
  let payload:any;try{payload=await response.json();}catch{return json({error:"inference_invalid_response"},502);}
  const reply=payload?.choices?.[0]?.message?.content;
  if(typeof reply!=="string"||!reply.trim())return json({error:"inference_empty_reply"},502);
  return json({test:{success:true,reply:reply.trim().slice(0,120)},activation_ready:true});
 }
 return json({engine:{configured,endpoint_valid:endpointValid,model_configured:!!inferenceModel,api_key_configured:!!Deno.env.get("ATHR_INFERENCE_API_KEY"),provider:"owner_managed_self_hosted"},activation_ready:configured});
});