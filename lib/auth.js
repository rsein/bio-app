import { supabase } from './supabase'

// cria a primeira conta de administrador
export async function signUpAdmin(email, password, name) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { ok: false, error: error.message }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    name,
    kind: 'admin',
  })
  if (profileError) return { ok: false, error: profileError.message }

  return { ok: true, userId: data.user.id }
}

// login de quem já tem conta (admin ou cuidador)
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false, error: 'E-mail ou senha incorretos.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single()

  return { ok: true, profile }
}

// resgatar um código de convite (cria conta + já vincula ao idoso certo)
export async function redeemInvite(code, email, password, name) {
  const { data: invite, error: inviteError } = await supabase
    .from('invites')
    .select('*')
    .eq('code', code)
    .single()

  if (inviteError || !invite) return { ok: false, error: 'Código inválido.' }

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { ok: false, error: error.message }

  const kind = invite.relation === 'Cuidador(a)' ? 'caregiver' : 'admin'

  await supabase.from('profiles').insert({ id: data.user.id, name, kind })
  await supabase.from('elder_access').insert({
    elder_id: invite.elder_id,
    account_id: data.user.id,
    relation: invite.relation,
  })
  await supabase.from('invites').delete().eq('code', code)

  return { ok: true, elderId: invite.elder_id, kind }
}

// login do idoso por PIN (chama a Edge Function elder-login)
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

export async function logout() {
  await supabase.auth.signOut()
}
