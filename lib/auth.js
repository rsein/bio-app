export async function elderLogin(elderId, pin) {
  const res = await fetch(
    `https://bbwaffoeitovrmxnuptt.supabase.co/functions/v1/elder-login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ elder_id: elderId, pin }),
    }
  )
  const data = await res.json()
  if (data.error) return { ok: false, error: data.error }

  window.location.href = data.action_link
  return { ok: true }
}