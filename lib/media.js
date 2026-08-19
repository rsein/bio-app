import { supabase } from './supabase'

// envia uma foto, áudio ou vídeo pra conversa com um idoso
export async function sendThreadMedia(elderId, threadId, senderId, file, type) {
  const ext = type === 'photo' ? 'jpg' : 'webm'
  const path = `${elderId}/${threadId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage.from('thread-media').upload(path, file)
  if (uploadError) return { ok: false, error: uploadError.message }

  const { error: insertError } = await supabase.from('thread_messages').insert({
    thread_id: threadId,
    sender: senderId,
    type, // 'photo' | 'audio' | 'video'
    media_path: path,
  })
  if (insertError) return { ok: false, error: insertError.message }

  return { ok: true, path }
}

import { sendThreadMedia } from '@/lib/media'

async function handlePhoto(file) {
  await sendThreadMedia(elderId, threadId, senderId, file, 'photo')
}

// gera um link temporário pra mostrar/tocar o arquivo (válido por 1 hora)
export async function getMediaUrl(path) {
  const { data, error } = await supabase.storage
    .from('thread-media')
    .createSignedUrl(path, 60 * 60)

  if (error) return null
  return data.signedUrl
}