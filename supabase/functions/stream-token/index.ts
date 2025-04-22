// supabase/functions/stream-token/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { StreamChat } from "npm:stream-chat";

serve(async (req) => {
  const { email, code } = await req.json();

  // Simple domain allowlist check
  const allowedDomains = ["vvk.lt", "kolegija.lt"];
  const domain = email.split("@")[1];
  if (!allowedDomains.includes(domain)) {
    return new Response("Email domain not allowed", { status: 403 });
  }

  // Validate email verification code
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data, error } = await supabaseClient
    .from("email_verification_codes")
    .select("*")
    .eq("code", code)
    .eq("email", email)
    .maybeSingle();

  if (!data || error) {
    return new Response("Invalid or expired verification code", {
      status: 400,
    });
  }

  // Initialize Stream Chat server client
  const serverClient = StreamChat.getInstance(
    Deno.env.get("STREAM_API_KEY")!,
    Deno.env.get("STREAM_API_SECRET")!
  );

  const userId = data.user_id;

  const token = serverClient.createToken(userId);

  return new Response(JSON.stringify({ token }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});