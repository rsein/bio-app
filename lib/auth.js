// lib/auth.js — adicione junto com as funções que já existem lá
export async function elderLogin(elderId, pin) {
  const res = await fetch(
    `https://SEU_PROJECT_REF.supabase.co/functions/v1/elder-login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ elder_id: elderId, pin }),
    }
  )
  const data = await res.json()
  if (data.error) return { ok: false, error: data.error }

  // abrir o link loga o navegador automaticamente como aquele idoso
  window.location.href = data.action_link
  return { ok: true }
}