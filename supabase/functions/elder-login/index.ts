import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // o navegador manda um pedido "OPTIONS" antes do pedido de verdade,
  // só pra perguntar se tem permissão — sem isso, ele nunca chega a mandar o resto
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const { elder_id, pin } = await req.json()

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const { data: elder, error } = await supabaseAdmin
    .from("elders")
    .select("id, pin_hash")
    .eq("id", elder_id)
    .single()

  if (error || !elder) {
    return new Response(JSON.stringify({ error: "Idoso não encontrado" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  if (elder.pin_hash) {
    const valid = await compare(pin, elder.pin_hash)
    if (!valid) {
      return new Response(JSON.stringify({ error: "PIN incorreto" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }
  }

  const fakeEmail = `elder-${elder_id}@bio.local`
  const { data: link, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: fakeEmail,
  })

  if (linkError) {
    return new Response(JSON.stringify({ error: linkError.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  return new Response(JSON.stringify({ action_link: link.properties.action_link }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
})
