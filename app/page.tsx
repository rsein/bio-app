'use client'
// 'use client' é obrigatório em qualquer página que use useState ou onClick no Next.js

import { useState } from 'react'
import { elderLogin } from '@/lib/auth'

export default function Page() {
  const [elderId, setElderId] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  async function handleElderLogin() {
    const result = await elderLogin(elderId, pin)
    if (!result.ok) setError(result.error)
    // se der certo, a própria função já redireciona a página
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Teste — login do idoso</h1>
      <input
        placeholder="ID do idoso (copie da tabela elders no Supabase)"
        value={elderId}
        onChange={(e) => setElderId(e.target.value)}
        style={{ display: 'block', marginBottom: 8 }}
      />
      <input
        placeholder="PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        style={{ display: 'block', marginBottom: 8 }}
      />
      <button onClick={handleElderLogin}>Entrar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}