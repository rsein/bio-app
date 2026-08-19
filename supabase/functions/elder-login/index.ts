import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"

serve(async (req) => {
  const { elder_id, pin } = await req.json()

  // SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já vêm prontos aqui, não precisa configurar
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
    return new Response(JSON.stringify({ error: "Idoso não encontrado" }), { status: 404 })
  }

  if (elder.pin_hash) {
    const valid = await compare(pin, elder.pin_hash)
    if (!valid) {
      return new Response(JSON.stringify({ error: "PIN incorreto" }), { status: 401 })
    }
  }

  const fakeEmail = `elder-${elder_id}@bio.local`
  const { data: link, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: fakeEmail,
  })

  if (linkError) {
    return new Response(JSON.stringify({ error: linkError.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ action_link: link.properties.action_link }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  })
})