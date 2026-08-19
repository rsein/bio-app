'use client'
// 'use client' é obrigatório: essa tela usa useState e onClick

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { signUpAdmin, login, redeemInvite, elderLogin, logout } from '@/lib/auth'

/* ---------- identidade visual do Bio ---------- */
const C = {
  inkBg: '#132422',
  paper: '#FBF6EE',
  paperCard: '#FFFFFF',
  teal: '#1F5C55',
  tealDark: '#153F3A',
  tealLine: '#D8E4DF',
  amber: '#E8A33D',
  coral: '#C0483A',
  textDark: '#1E2B28',
  textMuted: '#5F726D',
}

function TopBar({ title, onLogout }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', color: C.textDark }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, flex: 1, margin: 0 }}>{title}</h1>
      {onLogout && (
        <button
          onClick={onLogout}
          style={{ fontSize: 13, padding: '8px 14px', borderRadius: 999, background: C.tealLine, border: 'none', color: C.tealDark }}
        >
          Sair
        </button>
      )}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 12,
  fontSize: 14,
  background: C.paperCard,
  border: `1px solid ${C.tealLine}`,
  color: C.textDark,
  marginBottom: 12,
  boxSizing: 'border-box',
}

/* ---------- tela de login ---------- */
function LoginScreen({ accounts, elders }) {
  const [mode, setMode] = useState(null)
  const [selectedId, setSelectedId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [newName, setNewName] = useState('')

  const [selectedElder, setSelectedElder] = useState(null)
  const [pin, setPin] = useState('')

  const [inviteCode, setInviteCode] = useState('')
  const [inviteName, setInviteName] = useState('')

  const admins = accounts.filter((a) => a.kind === 'admin')
  const caregivers = accounts.filter((a) => a.kind === 'caregiver')

  async function submitCreateAccount() {
    setError('')
    if (!newName.trim() || !email.trim() || !password.trim()) { setError('Preencha nome, e-mail e senha.'); return }
    setLoading(true)
    const result = await signUpAdmin(email.trim(), password, newName.trim())
    setLoading(false)
    if (!result.ok) { setError(result.error); return }
    window.location.reload()
  }

  async function submitLogin() {
    setError('')
    if (!email.trim() || !password.trim()) { setError('Preencha e-mail e senha.'); return }
    setLoading(true)
    const result = await login(email.trim(), password)
    setLoading(false)
    if (!result.ok) { setError(result.error); return }
    window.location.reload()
  }

  async function submitInvite() {
    setError('')
    if (!inviteCode.trim() || !inviteName.trim() || !email.trim() || !password.trim()) {
      setError('Preencha código, nome, e-mail e senha.')
      return
    }
    setLoading(true)
    const result = await redeemInvite(inviteCode.trim().toUpperCase(), email.trim(), password, inviteName.trim())
    setLoading(false)
    if (!result.ok) { setError(result.error); return }
    window.location.reload()
  }

  async function submitElderLogin() {
    setError('')
    setLoading(true)
    const result = await elderLogin(selectedElder.id, pin)
    setLoading(false)
    if (!result.ok) setError(result.error)
    // se der certo, elderLogin já redireciona a página sozinha
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px', background: C.paper }}>
      <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', color: C.teal }}>Bio</p>
      <h1 style={{ fontSize: 26, fontWeight: 600, textAlign: 'center', margin: '4px 0 32px', color: C.textDark }}>Entrar</h1>

      {!mode && (
        <div>
          {elders.length > 0 && (
            <button
              onClick={() => { setMode('elder-pick'); setError('') }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: 18, borderRadius: 18, marginBottom: 12, background: C.inkBg, color: C.paper, border: 'none', textAlign: 'left' }}
            >
              <div style={{ padding: 12, borderRadius: 12, background: C.amber }}>🎙️</div>
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>Sou um dos idosos</p>
                <p style={{ fontSize: 13, opacity: 0.7, margin: 0 }}>Entrada simples, sem digitar muito</p>
              </div>
            </button>
          )}
          <button
            onClick={() => { setMode('admin'); setError('') }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: 18, borderRadius: 18, marginBottom: 12, background: C.paperCard, border: `1px solid ${C.tealLine}`, textAlign: 'left' }}
          >
            <div style={{ padding: 12, borderRadius: 12, background: C.teal }}>👨‍👩‍👦</div>
            <div>
              <p style={{ fontWeight: 600, margin: 0, color: C.textDark }}>Sou da família</p>
              <p style={{ fontSize: 13, margin: 0, color: C.textMuted }}>Esposa, filhos ou outro familiar</p>
            </div>
          </button>
          <button
            onClick={() => { setMode('cuidadora'); setError('') }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: 18, borderRadius: 18, marginBottom: 12, background: C.paperCard, border: `1px solid ${C.tealLine}`, textAlign: 'left' }}
          >
            <div style={{ padding: 12, borderRadius: 12, background: '#3F8A5E' }}>🩺</div>
            <div>
              <p style={{ fontWeight: 600, margin: 0, color: C.textDark }}>Sou cuidador(a)</p>
              <p style={{ fontSize: 13, margin: 0, color: C.textMuted }}>Acesso criado pela família</p>
            </div>
          </button>
          <button onClick={() => { setMode('criar-conta'); setError('') }} style={{ width: '100%', textAlign: 'center', padding: '12px 0', background: 'none', border: 'none', color: C.teal, fontSize: 14 }}>
            Sou família e ainda não tenho conta
          </button>
          <button onClick={() => { setMode('convite'); setError('') }} style={{ width: '100%', textAlign: 'center', padding: '4px 0', background: 'none', border: 'none', color: C.teal, fontSize: 14 }}>
            Tenho um código de convite
          </button>
        </div>
      )}

      {mode === 'criar-conta' && (
        <div>
          <input style={inputStyle} placeholder="Seu nome" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <input style={inputStyle} placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input style={inputStyle} type="password" placeholder="Criar uma senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p style={{ color: C.coral, fontSize: 13, textAlign: 'center' }}>{error}</p>}
          <button onClick={submitCreateAccount} disabled={loading} style={{ width: '100%', padding: 14, borderRadius: 16, background: C.teal, color: '#fff', border: 'none', fontWeight: 600 }}>
            {loading ? 'Criando...' : 'Criar conta e continuar'}
          </button>
          <button onClick={() => setMode(null)} style={{ width: '100%', textAlign: 'center', padding: '12px 0', background: 'none', border: 'none', color: C.textMuted }}>Voltar</button>
        </div>
      )}

      {mode === 'convite' && (
        <div>
          <input style={{ ...inputStyle, fontFamily: 'monospace', textAlign: 'center', letterSpacing: 2 }} placeholder="Código do convite" value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} />
          <input style={inputStyle} placeholder="Seu nome" value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
          <input style={inputStyle} placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input style={inputStyle} type="password" placeholder="Criar uma senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p style={{ color: C.coral, fontSize: 13, textAlign: 'center' }}>{error}</p>}
          <button onClick={submitInvite} disabled={loading} style={{ width: '100%', padding: 14, borderRadius: 16, background: C.teal, color: '#fff', border: 'none', fontWeight: 600 }}>
            {loading ? 'Entrando...' : 'Criar conta com o convite'}
          </button>
          <button onClick={() => setMode(null)} style={{ width: '100%', textAlign: 'center', padding: '12px 0', background: 'none', border: 'none', color: C.textMuted }}>Voltar</button>
        </div>
      )}

      {mode === 'elder-pick' && (
        <div>
          <p style={{ textAlign: 'center', color: C.textMuted, fontSize: 14, marginBottom: 12 }}>Toque no seu nome</p>
          {elders.map((el) => (
            <button
              key={el.id}
              onClick={() => { setSelectedElder(el); setMode('elder-pin'); setError('') }}
              style={{ width: '100%', padding: 16, borderRadius: 16, marginBottom: 10, background: C.inkBg, color: C.paper, border: 'none', fontSize: 17, fontWeight: 600 }}
            >
              {el.name}
            </button>
          ))}
          <button onClick={() => setMode(null)} style={{ width: '100%', textAlign: 'center', padding: '12px 0', background: 'none', border: 'none', color: C.textMuted }}>Voltar</button>
        </div>
      )}

      {mode === 'elder-pin' && selectedElder && (
        <div>
          <p style={{ textAlign: 'center', fontSize: 17, color: C.textDark, marginBottom: 16 }}>Oi, {selectedElder.name.split(' ')[0]}!</p>
          <input
            style={{ ...inputStyle, fontSize: 24, textAlign: 'center', letterSpacing: 6 }}
            placeholder="PIN (se tiver)"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          />
          {error && <p style={{ color: C.coral, fontSize: 13, textAlign: 'center' }}>{error}</p>}
          <button onClick={submitElderLogin} disabled={loading} style={{ width: '100%', padding: 16, borderRadius: 16, background: C.amber, color: C.inkBg, border: 'none', fontWeight: 700, fontSize: 16 }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <button onClick={() => setMode('elder-pick')} style={{ width: '100%', textAlign: 'center', padding: '12px 0', background: 'none', border: 'none', color: C.textMuted }}>Voltar</button>
        </div>
      )}

      {(mode === 'admin' || mode === 'cuidadora') && (
        <div>
          <input style={inputStyle} placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input style={inputStyle} type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p style={{ color: C.coral, fontSize: 13, textAlign: 'center' }}>{error}</p>}
          <button onClick={submitLogin} disabled={loading} style={{ width: '100%', padding: 14, borderRadius: 16, background: C.teal, color: '#fff', border: 'none', fontWeight: 600 }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <button onClick={() => setMode(null)} style={{ width: '100%', textAlign: 'center', padding: '12px 0', background: 'none', border: 'none', color: C.textMuted }}>Voltar</button>
        </div>
      )}

      <p style={{ fontSize: 11, textAlign: 'center', marginTop: 32, color: C.textMuted, opacity: 0.7 }}>
        ⚠️ Login de demonstração em produção real — teste à vontade.
      </p>
    </div>
  )
}

const RELATIONS = ['Filho(a)', 'Esposa(o)', 'Cuidador(a)', 'Outro familiar']

/* ---------- meus idosos ---------- */
function MeusIdososScreen({ elders, onSelectElder, onAddElder, onLogout }) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [notes, setNotes] = useState('')
  const [relation, setRelation] = useState(RELATIONS[0])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    setError('')
    if (!name.trim()) { setError('Preencha o nome.'); return }
    setSaving(true)
    const result = await onAddElder({ name: name.trim(), age, notes, relation })
    setSaving(false)
    if (!result.ok) { setError(result.error); return }
    setName(''); setAge(''); setNotes(''); setShowForm(false)
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60, background: C.paper }}>
      <TopBar title="Meus idosos" onLogout={onLogout} />
      <div style={{ padding: '0 20px' }}>
        <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 20 }}>
          Cada pessoa que você cuida fica separada aqui — dados, rotina e conversas de uma não aparecem pra outra.
        </p>

        {elders.length === 0 && (
          <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 16 }}>Nenhum idoso cadastrado ainda. Adicione o primeiro abaixo.</p>
        )}
        {elders.map((el) => (
          <button
            key={el.id}
            onClick={() => onSelectElder(el.id)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: 18, borderRadius: 18, marginBottom: 12, background: C.paperCard, border: `1px solid ${C.tealLine}`, textAlign: 'left' }}
          >
            <div style={{ padding: 12, borderRadius: 12, background: C.teal }}>🎙️</div>
            <div>
              <p style={{ fontWeight: 600, margin: 0, color: C.textDark }}>{el.name}</p>
              <p style={{ fontSize: 13, margin: 0, color: C.textMuted }}>{el.age ? `${el.age} anos` : 'Toque para abrir'}</p>
            </div>
          </button>
        ))}

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            style={{ width: '100%', padding: 16, borderRadius: 16, background: C.tealLine, color: C.tealDark, border: 'none', fontWeight: 600 }}
          >
            + Adicionar idoso
          </button>
        ) : (
          <div style={{ padding: 18, borderRadius: 18, background: C.paperCard, border: `1px solid ${C.tealLine}` }}>
            <input style={inputStyle} placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
            <input style={inputStyle} placeholder="Idade" value={age} onChange={(e) => setAge(e.target.value)} />
            <select style={inputStyle} value={relation} onChange={(e) => setRelation(e.target.value)}>
              {RELATIONS.filter((r) => r !== 'Cuidador(a)').map((r) => <option key={r} value={r}>Sua relação: {r}</option>)}
            </select>
            <textarea style={{ ...inputStyle, minHeight: 60 }} placeholder="Observações (ex: baixa visão, usa cadeira de rodas)" value={notes} onChange={(e) => setNotes(e.target.value)} />
            {error && <p style={{ color: C.coral, fontSize: 13 }}>{error}</p>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={submit} disabled={saving} style={{ flex: 1, padding: 12, borderRadius: 12, background: C.teal, color: '#fff', border: 'none', fontWeight: 600 }}>
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
              <button onClick={() => setShowForm(false)} style={{ padding: '0 16px', borderRadius: 12, background: C.tealLine, color: C.tealDark, border: 'none' }}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- app principal ---------- */
export default function App() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [elders, setElders] = useState([])
  const [myElders, setMyElders] = useState([])
  const [currentElderId, setCurrentElderId] = useState(null)

  useEffect(() => {
    load()
    const { data: listener } = supabase.auth.onAuthStateChange(() => load())
    return () => listener.subscription.unsubscribe()
  }, [])

  async function load() {
    setLoading(true)
    const { data: { session: s } } = await supabase.auth.getSession()
    setSession(s)

    const { data: accountsData } = await supabase.from('profiles').select('*')
    setAccounts(accountsData || [])

    const { data: eldersData } = await supabase.from('elders').select('*')
    setElders(eldersData || [])

    if (s) {
      if (s.user.email && s.user.email.startsWith('elder-') && s.user.email.endsWith('@bio.local')) {
        const elderId = s.user.email.replace('elder-', '').replace('@bio.local', '')
        const elder = (eldersData || []).find((e) => e.id === elderId)
        setProfile({ kind: 'elder', name: elder ? elder.name : 'Idoso' })
        setCurrentElderId(elderId)
      } else {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', s.user.id).single()
        setProfile(p)

        const { data: accessRows } = await supabase.from('elder_access').select('elder_id').eq('account_id', s.user.id)
        const myIds = (accessRows || []).map((r) => r.elder_id)
        setMyElders((eldersData || []).filter((e) => myIds.includes(e.id)))
      }
    } else {
      setProfile(null)
      setMyElders([])
      setCurrentElderId(null)
    }
    setLoading(false)
  }

  async function handleLogout() {
    await logout()
    window.location.href = '/'
  }

  async function handleAddElder({ name, age, notes, relation }) {
    const { data: newElder, error: elderError } = await supabase
      .from('elders')
      .insert({ name, age: age ? parseInt(age, 10) : null, notes })
      .select()
      .single()
    if (elderError) return { ok: false, error: elderError.message }

    const { error: accessError } = await supabase.from('elder_access').insert({
      elder_id: newElder.id,
      account_id: session.user.id,
      relation,
    })
    if (accessError) return { ok: false, error: accessError.message }

    await load()
    setCurrentElderId(newElder.id)
    return { ok: true }
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.paper, color: C.textMuted }}>Carregando…</div>
  }

  if (!session) {
    return <LoginScreen accounts={accounts} elders={elders} />
  }

  if (profile && profile.kind === 'admin' && !currentElderId) {
    return (
      <MeusIdososScreen
        elders={myElders}
        onSelectElder={(id) => setCurrentElderId(id)}
        onAddElder={handleAddElder}
        onLogout={handleLogout}
      />
    )
  }

  const currentElder = elders.find((e) => e.id === currentElderId)

  // dentro de um idoso — placeholder simples por enquanto (Cadastro, Painel da Família... vêm no próximo passo)
  return (
    <div style={{ minHeight: '100vh', background: C.paper }}>
      <TopBar title={currentElder ? currentElder.name : 'Bio'} onLogout={handleLogout} />
      <div style={{ padding: 24 }}>
        {profile && profile.kind === 'admin' && (
          <button
            onClick={() => setCurrentElderId(null)}
            style={{ marginBottom: 16, fontSize: 13, padding: '8px 16px', borderRadius: 999, background: C.paperCard, color: C.teal, border: `1px solid ${C.tealLine}` }}
          >
            ↺ Trocar de idoso
          </button>
        )}
        <p style={{ fontSize: 18, color: C.textDark }}>
          Você está em <strong>{currentElder ? currentElder.name : '...'}</strong>, logado como <strong>{profile ? profile.name : '...'}</strong>.
        </p>
        <p style={{ fontSize: 14, color: C.textMuted, marginTop: 12 }}>
          As próximas telas (Cadastro, Painel da Família, Assistente...) entram no próximo passo.
        </p>
      </div>
    </div>
  )
}
