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

function TopBar({ title, onBack, onLogout }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', color: C.textDark }}>
      {onBack && (
        <button onClick={onBack} style={{ padding: 8, borderRadius: 999, background: C.tealLine, border: 'none', fontSize: 16 }}>←</button>
      )}
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

const DEFAULT_ROUTINE = ['Café da manhã', 'Almoço', 'Banho', 'Passeio', 'Jantar', 'Exercício', 'Fisioterapia']
const SUGGESTED_ROUTINE = ['Lanche', 'Leitura', 'Oração', 'Meditação', 'Banho de sol', 'Chamada com a família', 'Alongamento', 'Jogo de memória']
const WEEKDAYS = [
  ['domingo', 'domingo'], ['segunda', 'segunda-feira'], ['terça', 'terça-feira'], ['terca', 'terça-feira'],
  ['quarta', 'quarta-feira'], ['quinta', 'quinta-feira'], ['sexta', 'sexta-feira'],
  ['sábado', 'sábado'], ['sabado', 'sábado'],
]

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function timeNow() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
function parseDateTime(text) {
  const t = text.toLowerCase()
  let when = null
  if (/\bamanh[ãa]\b/.test(t)) when = 'amanhã'
  else if (/\bhoje\b/.test(t)) when = 'hoje'
  else { for (const [k, label] of WEEKDAYS) { if (t.includes(k)) { when = label; break } } }
  let hour = null, minute = 0
  let m = t.match(/(\d{1,2})[:h](\d{2})/)
  if (m) { hour = parseInt(m[1], 10); minute = parseInt(m[2], 10) }
  else { m = t.match(/\bàs?\s*(\d{1,2})\s*h(oras)?\b/); if (m) hour = parseInt(m[1], 10) }
  return { when, hour, minute }
}
function cleanReminderText(text) {
  return text
    .replace(/^me lembr[ae]\s*(de|que)?\s*/i, '')
    .replace(/\bamanh[ãa]\b/gi, '').replace(/\bhoje\b/gi, '')
    .replace(/\bàs?\s*\d{1,2}([:h]\d{2})?\s*(horas?)?\b/gi, '')
    .replace(/\b(domingo|segunda(-feira)?|terça(-feira)?|terca(-feira)?|quarta(-feira)?|quinta(-feira)?|sexta(-feira)?|sábado|sabado)\b/gi, '')
    .replace(/\s{2,}/g, ' ').trim()
}
function formatReminder(r) {
  const parts = []
  if (r.when_label) parts.push(r.when_label)
  if (r.hour !== null && r.hour !== undefined) parts.push(`${String(r.hour).padStart(2, '0')}:${String(r.minute || 0).padStart(2, '0')}`)
  return parts.length ? `${r.text} (${parts.join(', ')})` : r.text
}

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

/* ---------- menu principal (dentro de um idoso) ---------- */
function HomeMenu({ elder, kindLabel, onNavigate, onSwitchElder, onLogout, isAdmin }) {
  const items = [
    { key: 'idoso', label: `Tela de ${elder ? elder.name.split(' ')[0] : 'Idoso'}`, desc: 'Assistente por voz', icon: '🎙️', dark: true },
    { key: 'familia', label: 'Painel da Família', desc: 'Lembretes, remédios, rotina', icon: '👨‍👩‍👦' },
    { key: 'cuidadora', label: 'Área da Cuidadora', desc: 'Checklist do dia', icon: '🩺' },
    ...(isAdmin ? [{ key: 'cadastro', label: 'Cadastrar Família', desc: 'Convites e acesso', icon: '➕' }] : []),
  ]
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60, background: C.paper }}>
      <div style={{ padding: '32px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: C.teal, margin: 0 }}>Bio</p>
          <h1 style={{ fontSize: 26, fontWeight: 600, margin: '4px 0 0', color: C.textDark }}>{elder ? elder.name : '...'}</h1>
        </div>
        <button onClick={onLogout} style={{ fontSize: 13, padding: '8px 14px', borderRadius: 999, background: C.tealLine, border: 'none', color: C.tealDark }}>Sair</button>
      </div>
      <div style={{ padding: '0 20px 16px' }}>
        <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, background: C.tealLine, color: C.tealDark, fontSize: 12, fontWeight: 600 }}>
          {kindLabel.toUpperCase()}
        </span>
      </div>
      {isAdmin && (
        <div style={{ padding: '0 20px 16px' }}>
          <button onClick={onSwitchElder} style={{ fontSize: 13, padding: '8px 16px', borderRadius: 999, background: C.paperCard, color: C.teal, border: `1px solid ${C.tealLine}` }}>
            ↺ Trocar de idoso
          </button>
        </div>
      )}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => onNavigate(it.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: 18, borderRadius: 18, textAlign: 'left', border: it.dark ? 'none' : `1px solid ${C.tealLine}`,
              background: it.dark ? C.inkBg : C.paperCard, color: it.dark ? C.paper : C.textDark,
            }}
          >
            <div style={{ padding: 12, borderRadius: 12, background: it.dark ? C.amber : C.teal, fontSize: 18 }}>{it.icon}</div>
            <div>
              <p style={{ fontWeight: 600, margin: 0 }}>{it.label}</p>
              <p style={{ fontSize: 13, margin: 0, opacity: 0.75 }}>{it.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- cadastro / convites ---------- */
function CadastroScreen({ elder, elderId, accountId, onBack }) {
  const [family, setFamily] = useState([])
  const [invites, setInvites] = useState([])
  const [relation, setRelation] = useState(RELATIONS[0])
  const [lastCode, setLastCode] = useState(null)
  const [copyStatus, setCopyStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [elderId])

  async function load() {
    setLoading(true)
    const { data: accessRows } = await supabase.from('elder_access').select('*').eq('elder_id', elderId)
    const { data: profilesData } = await supabase.from('profiles').select('*')
    const merged = (accessRows || []).map((row) => {
      const acc = (profilesData || []).find((p) => p.id === row.account_id)
      return acc ? { accountId: acc.id, name: acc.name, relation: row.relation } : null
    }).filter(Boolean)
    setFamily(merged)

    const { data: invitesData } = await supabase.from('invites').select('*').eq('elder_id', elderId)
    setInvites(invitesData || [])
    setLoading(false)
  }

  function genCode() {
    return Math.random().toString(36).slice(2, 8).toUpperCase()
  }

  async function generate() {
    setError('')
    const code = genCode()
    const { error: insertError } = await supabase.from('invites').insert({ code, elder_id: elderId, relation })
    if (insertError) { setError(insertError.message); return }
    setLastCode({ code, relation })
    setCopyStatus('')
    load()
  }

  function inviteText(code, rel) {
    return `Oi! Pra acessar o Bio como ${rel.toLowerCase()}, entra no app, toque em "Tenho um código de convite" e use o código: ${code}`
  }

  async function shareInvite() {
    const text = inviteText(lastCode.code, lastCode.relation)
    if (navigator.share) {
      try { await navigator.share({ title: 'Convite Bio', text }); return } catch {}
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus('Copiado! Agora é só colar numa mensagem.')
    } catch {
      setCopyStatus('Não consegui copiar automaticamente — copie o código manualmente.')
    }
  }

  function whatsappShare() {
    const text = encodeURIComponent(inviteText(lastCode.code, lastCode.relation))
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  async function removeMember(accId) {
    await supabase.from('elder_access').delete().eq('elder_id', elderId).eq('account_id', accId)
    load()
  }

  async function removeInvite(code) {
    await supabase.from('invites').delete().eq('code', code)
    load()
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60, background: C.paper }}>
      <TopBar title="Cadastrar família" onBack={onBack} />
      <div style={{ padding: '0 20px' }}>
        <div style={{ padding: 18, borderRadius: 18, background: C.paperCard, border: `1px solid ${C.tealLine}`, marginBottom: 20 }}>
          <p style={{ fontWeight: 600, margin: '0 0 4px', color: C.textDark }}>Convidar pessoa</p>
          <p style={{ fontSize: 12, margin: '0 0 12px', color: C.textMuted }}>Gere um código e compartilhe — a pessoa cria a própria conta.</p>
          <select style={inputStyle} value={relation} onChange={(e) => setRelation(e.target.value)}>
            {RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <button onClick={generate} style={{ width: '100%', padding: 12, borderRadius: 12, background: C.teal, color: '#fff', border: 'none', fontWeight: 600 }}>
            + Gerar código de convite
          </button>
          {error && <p style={{ color: C.coral, fontSize: 13 }}>{error}</p>}
          {lastCode && (
            <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: C.tealLine }}>
              <p style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, textAlign: 'center', color: C.tealDark, margin: 0, fontFamily: 'monospace' }}>{lastCode.code}</p>
              <p style={{ fontSize: 12, textAlign: 'center', color: C.tealDark, marginTop: 6 }}>Compartilhe com a pessoa ({lastCode.relation}).</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button onClick={whatsappShare} style={{ flex: 1, padding: 10, borderRadius: 10, background: '#25D366', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600 }}>
                  Enviar por WhatsApp
                </button>
                <button onClick={shareInvite} style={{ flex: 1, padding: 10, borderRadius: 10, background: '#fff', color: C.tealDark, border: `1px solid ${C.tealDark}`, fontSize: 13, fontWeight: 600 }}>
                  Copiar
                </button>
              </div>
              {copyStatus && <p style={{ fontSize: 12, textAlign: 'center', color: C.tealDark, marginTop: 6 }}>{copyStatus}</p>}
            </div>
          )}
        </div>

        {!loading && invites.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontWeight: 600, margin: '0 0 10px', color: C.textDark }}>Convites aguardando ({invites.length})</p>
            {invites.map((inv) => (
              <div key={inv.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 14, background: C.paperCard, border: `1px solid ${C.tealLine}`, marginBottom: 8 }}>
                <div>
                  <p style={{ fontFamily: 'monospace', fontWeight: 600, margin: 0, color: C.textDark }}>{inv.code}</p>
                  <p style={{ fontSize: 12, margin: 0, color: C.textMuted }}>{inv.relation} · ainda não usado</p>
                </div>
                <button onClick={() => removeInvite(inv.code)} style={{ padding: 8, borderRadius: 999, background: '#F3DAD6', border: 'none' }}>🗑️</button>
              </div>
            ))}
          </div>
        )}

        <div>
          <p style={{ fontWeight: 600, margin: '0 0 10px', color: C.textDark }}>Pessoas cadastradas ({family.length})</p>
          {loading && <p style={{ fontSize: 13, color: C.textMuted }}>Carregando...</p>}
          {!loading && family.length === 0 && <p style={{ fontSize: 13, color: C.textMuted }}>Ninguém entrou ainda. Gere um convite acima.</p>}
          {family.map((m) => (
            <div key={m.accountId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 14, background: C.paperCard, border: `1px solid ${C.tealLine}`, marginBottom: 8 }}>
              <div>
                <p style={{ fontWeight: 500, margin: 0, color: C.textDark }}>{m.name}</p>
                <p style={{ fontSize: 12, margin: 0, color: C.textMuted }}>{m.relation}</p>
              </div>
              <button onClick={() => removeMember(m.accountId)} style={{ padding: 8, borderRadius: 999, background: '#F3DAD6', border: 'none' }}>🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- painel da família ---------- */
const cardStyle = { padding: 18, borderRadius: 18, background: C.paperCard, border: `1px solid ${C.tealLine}`, marginBottom: 20 }
const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 12, background: C.paper, marginBottom: 8 }
const smallBtn = { padding: '8px 14px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 600 }

function FamiliaScreen({ elderId, elderName, onBack }) {
  const [loading, setLoading] = useState(true)

  const [reminders, setReminders] = useState([])
  const [reminderText, setReminderText] = useState('')

  const [medications, setMedications] = useState([])
  const [medLogs, setMedLogs] = useState({}) // medicationId -> [{id, time}]
  const [medName, setMedName] = useState('')
  const [medDose, setMedDose] = useState('')

  const [routineItems, setRoutineItems] = useState([])
  const [routineDone, setRoutineDone] = useState({}) // routineItemId -> {logId, done}
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [customActivity, setCustomActivity] = useState('')

  useEffect(() => { load() }, [elderId])

  async function load() {
    setLoading(true)
    const today = todayKey()

    const { data: remData } = await supabase.from('reminders').select('*').eq('elder_id', elderId).order('created_at')
    setReminders(remData || [])

    const { data: medData } = await supabase.from('medications').select('*').eq('elder_id', elderId).order('created_at')
    setMedications(medData || [])
    if (medData && medData.length > 0) {
      const medIds = medData.map((m) => m.id)
      const { data: logsData } = await supabase.from('medication_logs').select('*').in('medication_id', medIds)
      const grouped = {}
      ;(logsData || []).forEach((log) => {
        const logDate = new Date(log.given_at)
        const logKey = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, '0')}-${String(logDate.getDate()).padStart(2, '0')}`
        if (logKey !== today) return
        if (!grouped[log.medication_id]) grouped[log.medication_id] = []
        grouped[log.medication_id].push({ id: log.id, time: logDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) })
      })
      setMedLogs(grouped)
    } else {
      setMedLogs({})
    }

    let { data: routineData } = await supabase.from('routine_items').select('*').eq('elder_id', elderId).order('created_at')
    if (!routineData || routineData.length === 0) {
      const seed = DEFAULT_ROUTINE.map((name) => ({ elder_id: elderId, name }))
      const { data: seeded } = await supabase.from('routine_items').insert(seed).select()
      routineData = seeded || []
    }
    setRoutineItems(routineData || [])

    if (routineData && routineData.length > 0) {
      const itemIds = routineData.map((r) => r.id)
      const { data: logsToday } = await supabase.from('routine_logs').select('*').in('routine_item_id', itemIds).eq('date', today)
      const doneMap = {}
      ;(logsToday || []).forEach((log) => { doneMap[log.routine_item_id] = { logId: log.id, done: log.done } })
      setRoutineDone(doneMap)
    }

    setLoading(false)
  }

  // lembretes
  async function addReminder() {
    if (!reminderText.trim()) return
    const dt = parseDateTime(reminderText)
    const cleaned = cleanReminderText(reminderText) || reminderText
    await supabase.from('reminders').insert({ elder_id: elderId, text: cleaned, when_label: dt.when, hour: dt.hour, minute: dt.minute, created_by: 'família', done: false })
    setReminderText('')
    load()
  }
  async function toggleReminder(r) {
    await supabase.from('reminders').update({ done: !r.done }).eq('id', r.id)
    load()
  }

  // remédios
  async function addMedication() {
    if (!medName.trim()) return
    await supabase.from('medications').insert({ elder_id: elderId, name: medName.trim(), dose: medDose.trim() })
    setMedName(''); setMedDose('')
    load()
  }
  async function removeMedication(id) {
    await supabase.from('medications').delete().eq('id', id)
    load()
  }
  async function markGiven(medId) {
    await supabase.from('medication_logs').insert({ medication_id: medId, given_at: new Date().toISOString(), logged_by: 'família' })
    load()
  }
  async function removeDose(logId) {
    await supabase.from('medication_logs').delete().eq('id', logId)
    load()
  }

  // rotina
  async function toggleRoutine(item) {
    const today = todayKey()
    const current = routineDone[item.id]
    if (current && current.logId) {
      await supabase.from('routine_logs').update({ done: !current.done }).eq('id', current.logId)
    } else {
      await supabase.from('routine_logs').insert({ elder_id: elderId, routine_item_id: item.id, date: today, done: true })
    }
    load()
  }
  async function addSuggested(name) {
    await supabase.from('routine_items').insert({ elder_id: elderId, name })
    load()
  }
  async function submitCustomActivity() {
    if (!customActivity.trim()) return
    await supabase.from('routine_items').insert({ elder_id: elderId, name: customActivity.trim() })
    setCustomActivity(''); setShowAddActivity(false)
    load()
  }
  async function removeRoutineItem(id) {
    await supabase.from('routine_items').delete().eq('id', id)
    load()
  }

  const routineNames = routineItems.map((r) => r.name.toLowerCase())
  const availableSuggestions = SUGGESTED_ROUTINE.filter((s) => !routineNames.includes(s.toLowerCase()))

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60, background: C.paper }}>
      <TopBar title="Painel da família" onBack={onBack} />
      <div style={{ padding: '0 20px' }}>
        {loading && <p style={{ fontSize: 13, color: C.textMuted }}>Carregando...</p>}

        {/* lembretes */}
        <div style={cardStyle}>
          <p style={{ fontWeight: 600, margin: '0 0 10px', color: C.textDark }}>🔔 Lembretes</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
              placeholder="Ex: consulta amanhã às 10h"
              value={reminderText}
              onChange={(e) => setReminderText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addReminder() }}
            />
            <button onClick={addReminder} style={{ ...smallBtn, background: C.teal, color: '#fff' }}>Add</button>
          </div>
          {reminders.length === 0 && <p style={{ fontSize: 13, color: C.textMuted }}>Nenhum lembrete ainda.</p>}
          {reminders.map((r) => (
            <button key={r.id} onClick={() => toggleReminder(r)} style={{ ...rowStyle, width: '100%', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
              <span style={{ fontSize: 14, color: r.done ? C.textMuted : C.textDark, textDecoration: r.done ? 'line-through' : 'none' }}>
                {r.done ? '✅ ' : '⬜ '}{formatReminder(r)}
              </span>
              <span style={{ fontSize: 11, color: C.textMuted }}>{r.created_by}</span>
            </button>
          ))}
        </div>

        {/* remédios */}
        <div style={cardStyle}>
          <p style={{ fontWeight: 600, margin: '0 0 10px', color: C.textDark }}>💊 Remédios</p>
          {medications.map((med) => {
            const doses = medLogs[med.id] || []
            return (
              <div key={med.id} style={{ padding: 12, borderRadius: 12, background: C.paper, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 500, margin: 0, fontSize: 14, color: C.textDark }}>{med.name}</p>
                    {med.dose && <p style={{ fontSize: 12, margin: 0, color: C.textMuted }}>{med.dose}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => markGiven(med.id)} style={{ ...smallBtn, background: '#3F8A5E', color: '#fff' }}>Dei agora</button>
                    <button onClick={() => removeMedication(med.id)} style={{ padding: 8, borderRadius: 999, background: '#F3DAD6', border: 'none' }}>🗑️</button>
                  </div>
                </div>
                {doses.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {doses.map((d) => (
                      <span key={d.id} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: '#DCEBE0', color: C.tealDark }}>
                        {d.time} <button onClick={() => removeDose(d.id)} style={{ border: 'none', background: 'none', marginLeft: 4, cursor: 'pointer' }}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} placeholder="Nome do remédio" value={medName} onChange={(e) => setMedName(e.target.value)} />
            <input style={{ ...inputStyle, marginBottom: 0, width: 90 }} placeholder="Dose" value={medDose} onChange={(e) => setMedDose(e.target.value)} />
            <button onClick={addMedication} style={{ ...smallBtn, background: C.teal, color: '#fff' }}>+</button>
          </div>
        </div>

        {/* rotina */}
        <div style={cardStyle}>
          <p style={{ fontWeight: 600, margin: '0 0 10px', color: C.textDark }}>✅ Rotina de hoje</p>
          {routineItems.map((item) => {
            const state = routineDone[item.id]
            const done = state ? state.done : false
            return (
              <div key={item.id} style={{ ...rowStyle }}>
                <button onClick={() => toggleRoutine(item)} style={{ flex: 1, textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: done ? C.textMuted : C.textDark }}>
                  {done ? '✅' : '⬜'} {item.name}
                </button>
                <button onClick={() => removeRoutineItem(item.id)} style={{ border: 'none', background: 'none', color: C.textMuted, cursor: 'pointer' }}>✕</button>
              </div>
            )
          })}
          {!showAddActivity ? (
            <button onClick={() => setShowAddActivity(true)} style={{ width: '100%', padding: 12, borderRadius: 12, background: C.tealLine, color: C.tealDark, border: 'none', fontWeight: 600, marginTop: 4 }}>
              + Adicionar atividade
            </button>
          ) : (
            <div style={{ marginTop: 8 }}>
              {availableSuggestions.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {availableSuggestions.map((s) => (
                    <button key={s} onClick={() => addSuggested(s)} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 999, background: C.tealLine, color: C.tealDark, border: 'none' }}>+ {s}</button>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} placeholder="Ou digite uma atividade nova" value={customActivity} onChange={(e) => setCustomActivity(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submitCustomActivity() }} />
                <button onClick={submitCustomActivity} style={{ ...smallBtn, background: C.teal, color: '#fff' }}>+</button>
                <button onClick={() => setShowAddActivity(false)} style={{ ...smallBtn, background: C.tealLine, color: C.tealDark }}>✕</button>
              </div>
            </div>
          )}
        </div>
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
  const [elderView, setElderView] = useState('home')

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
  const kindLabel = profile && profile.kind === 'elder' ? 'sessão do idoso' : profile && profile.kind === 'caregiver' ? 'sessão de cuidador(a)' : 'sessão de administrador'
  const isAdmin = profile && profile.kind === 'admin'

  function goSwitchElder() {
    setCurrentElderId(null)
    setElderView('home')
  }

  if (elderView === 'cadastro' && isAdmin) {
    return (
      <CadastroScreen
        elder={currentElder}
        elderId={currentElderId}
        accountId={session.user.id}
        onBack={() => setElderView('home')}
      />
    )
  }

  if (elderView === 'familia') {
    return <FamiliaScreen elderId={currentElderId} elderName={currentElder ? currentElder.name : ''} onBack={() => setElderView('home')} />
  }

  if (elderView === 'idoso' || elderView === 'cuidadora') {
    const labels = { idoso: `Tela de ${currentElder ? currentElder.name.split(' ')[0] : 'Idoso'}`, cuidadora: 'Área da Cuidadora' }
    return (
      <div style={{ minHeight: '100vh', background: C.paper }}>
        <TopBar title={labels[elderView]} onBack={() => setElderView('home')} />
        <div style={{ padding: 24 }}>
          <p style={{ fontSize: 15, color: C.textMuted }}>Essa tela ainda está sendo construída — chega em breve.</p>
        </div>
      </div>
    )
  }

  return (
    <HomeMenu
      elder={currentElder}
      kindLabel={kindLabel}
      isAdmin={isAdmin}
      onNavigate={setElderView}
      onSwitchElder={goSwitchElder}
      onLogout={handleLogout}
    />
  )
}
