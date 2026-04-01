import { createClient } from './client'

export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  balance: number
  created_at: string
  updated_at: string
}

export type Transaction = {
  id: string
  user_id: string
  type: 'Withdrawal' | 'Credit' | 'Deposit'
  method: 'bank' | 'crypto' | 'admin' | null
  amount: number
  status: 'Pending' | 'Completed' | 'Failed'
  beneficiary_name?: string | null
  bank_name?: string | null
  swift?: string | null
  iban?: string | null
  routing?: string | null
  network?: string | null
  address?: string | null
  note?: string | null
  created_at: string
}

export type Notification = {
  id: number
  user_id: string
  type: 'investment' | 'dividend' | 'alert' | 'info' | 'credit' | 'withdrawal'
  title: string
  message: string
  read: boolean
  created_at: string
}

export type ChatMessage = {
  id: number
  user_id: string
  role: 'user' | 'agent'
  text: string | null
  image_url: string | null
  created_at: string
}

export type UserSettings = {
  user_id: string
  currency: string
  language: string
  theme: string
  notif_email: boolean
  notif_push: boolean
  notif_sms: boolean
  notif_marketing: boolean
  security_2fa: boolean
  security_login_alerts: boolean
  security_session_timeout: boolean
}

// ── Profile ──────────────────────────────────────────────
export async function getProfile(userId: string): Promise<Profile | null> {
  const sb = createClient()
  const { data } = await sb.from('profiles').select('*').eq('id', userId).single()
  return data
}

export async function updateProfile(userId: string, updates: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>) {
  const sb = createClient()
  return sb.from('profiles').update(updates).eq('id', userId)
}

// ── Transactions ─────────────────────────────────────────
export async function getTransactions(userId: string): Promise<Transaction[]> {
  const sb = createClient()
  const { data } = await sb.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return data ?? []
}

export async function insertTransaction(tx: Omit<Transaction, 'created_at'>) {
  const sb = createClient()
  return sb.from('transactions').insert(tx)
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const sb = createClient()
  const { data } = await sb.from('transactions').select('*, profiles(email, full_name)').order('created_at', { ascending: false })
  return data ?? []
}

// ── Notifications ─────────────────────────────────────────
export async function getNotifications(userId: string): Promise<Notification[]> {
  const sb = createClient()
  const { data } = await sb.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return data ?? []
}

export async function markNotificationRead(id: number) {
  const sb = createClient()
  return sb.from('notifications').update({ read: true }).eq('id', id)
}

export async function markAllNotificationsRead(userId: string) {
  const sb = createClient()
  return sb.from('notifications').update({ read: true }).eq('user_id', userId)
}

// ── Chat ──────────────────────────────────────────────────
export async function getChatMessages(userId: string): Promise<ChatMessage[]> {
  const sb = createClient()
  const { data } = await sb.from('chat_messages').select('*').eq('user_id', userId).order('created_at', { ascending: true })
  return data ?? []
}

export async function insertChatMessage(msg: Omit<ChatMessage, 'id' | 'created_at'>) {
  const sb = createClient()
  return sb.from('chat_messages').insert(msg)
}

export async function getAllChatMessages() {
  const sb = createClient()
  const { data } = await sb.from('chat_messages').select('*, profiles(email, full_name)').order('created_at', { ascending: false })
  return data ?? []
}

export async function getChatUsers() {
  const sb = createClient()
  const { data } = await sb
    .from('chat_messages')
    .select('user_id, profiles(email, full_name)')
    .eq('role', 'user')
    .order('created_at', { ascending: false })
  // deduplicate by user_id
  const seen = new Set<string>()
  return (data ?? []).filter(m => { if (seen.has(m.user_id)) return false; seen.add(m.user_id); return true })
}

// ── Settings ──────────────────────────────────────────────
export async function getSettings(userId: string): Promise<UserSettings | null> {
  const sb = createClient()
  const { data } = await sb.from('user_settings').select('*').eq('user_id', userId).single()
  return data
}

export async function upsertSettings(settings: Partial<UserSettings> & { user_id: string }) {
  const sb = createClient()
  return sb.from('user_settings').upsert(settings)
}

// ── Admin ─────────────────────────────────────────────────
export async function getAllProfiles(): Promise<Profile[]> {
  const sb = createClient()
  const { data } = await sb.from('profiles').select('*').order('created_at', { ascending: false })
  return data ?? []
}

export async function adminUpdateBalance(userId: string, newBalance: number) {
  const sb = createClient()
  return sb.from('profiles').update({ balance: newBalance }).eq('id', userId)
}

export async function adminUpdateTransactionStatus(txId: string, status: 'Completed' | 'Failed') {
  const sb = createClient()
  return sb.from('transactions').update({ status }).eq('id', txId)
}

// ── Investments ───────────────────────────────────────────
export type Investment = {
  id: string
  user_id: string
  amount: number
  profit_loss: number | null
  status: 'active' | 'completed'
  start_time: string
  end_time: string
  created_at: string
}

export async function getUserInvestments(userId: string): Promise<Investment[]> {
  const sb = createClient()
  const { data } = await sb.from('investments').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return data ?? []
}

export async function insertInvestment(userId: string, amount: number): Promise<{ data: Investment | null; error: string | null }> {
  const sb = createClient()
  const { data, error } = await sb
    .from('investments')
    .insert({ user_id: userId, amount })
    .select('*')
    .single()
  return { data, error: error?.message ?? null }
}

export async function completeInvestment(id: string, profitLoss: number): Promise<{ error: string | null }> {
  const sb = createClient()
  const { error } = await sb
    .from('investments')
    .update({ status: 'completed', profit_loss: profitLoss })
    .eq('id', id)
  return { error: error?.message ?? null }
}

// ── Storage (chat images) ─────────────────────────────────
export async function uploadChatImage(userId: string, file: File): Promise<string | null> {
  const sb = createClient()
  const path = `${userId}/${Date.now()}_${file.name}`
  const { error } = await sb.storage.from('chat-images').upload(path, file)
  if (error) return null
  const { data } = sb.storage.from('chat-images').getPublicUrl(path)
  return data.publicUrl
}
