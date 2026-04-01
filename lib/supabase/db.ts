import { createClient } from './client'

async function dbProxy(body: object) {
  const res = await fetch('/api/db', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'DB error')
  return json
}

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
  try { return await dbProxy({ table: 'profiles', action: 'select', filters: [['id', userId]], single: true }) } catch { return null }
}

export async function updateProfile(userId: string, updates: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>) {
  return dbProxy({ table: 'profiles', action: 'update', payload: updates, filters: [['id', userId]] })
}

// ── Transactions ─────────────────────────────────────────
export async function getTransactions(userId: string): Promise<Transaction[]> {
  try { return await dbProxy({ table: 'transactions', action: 'select', filters: [['user_id', userId]], order: { col: 'created_at', asc: false } }) } catch { return [] }
}

export async function insertTransaction(tx: Omit<Transaction, 'created_at'>) {
  return dbProxy({ table: 'transactions', action: 'insert', payload: tx })
}

export async function getAllTransactions(): Promise<Transaction[]> {
  try { return await dbProxy({ table: 'transactions', action: 'select', order: { col: 'created_at', asc: false } }) } catch { return [] }
}

// ── Notifications ─────────────────────────────────────────
export async function getNotifications(userId: string): Promise<Notification[]> {
  try { return await dbProxy({ table: 'notifications', action: 'select', filters: [['user_id', userId]], order: { col: 'created_at', asc: false } }) } catch { return [] }
}

export async function markNotificationRead(id: number) {
  return dbProxy({ table: 'notifications', action: 'update', payload: { read: true }, filters: [['id', id]] })
}

export async function markAllNotificationsRead(userId: string) {
  return dbProxy({ table: 'notifications', action: 'update', payload: { read: true }, filters: [['user_id', userId]] })
}

// ── Chat ──────────────────────────────────────────────────
export async function getChatMessages(userId: string): Promise<ChatMessage[]> {
  try { return await dbProxy({ table: 'chat_messages', action: 'select', filters: [['user_id', userId]], order: { col: 'created_at', asc: true } }) } catch { return [] }
}

export async function insertChatMessage(msg: Omit<ChatMessage, 'id' | 'created_at'>) {
  return dbProxy({ table: 'chat_messages', action: 'insert', payload: msg })
}

export async function getAllChatMessages() {
  try { return await dbProxy({ table: 'chat_messages', action: 'select', order: { col: 'created_at', asc: false } }) } catch { return [] }
}

export async function getChatUsers() {
  try {
    const all = await dbProxy({ table: 'chat_messages', action: 'select', order: { col: 'created_at', asc: false } })
    const seen = new Set<string>()
    return (all as any[]).filter(m => m.role === 'user' && (!seen.has(m.user_id) ? seen.add(m.user_id) || true : false))
  } catch { return [] }
}

// ── Settings ──────────────────────────────────────────────
export async function getSettings(userId: string): Promise<UserSettings | null> {
  try { return await dbProxy({ table: 'user_settings', action: 'select', filters: [['user_id', userId]], single: true }) } catch { return null }
}

export async function upsertSettings(settings: Partial<UserSettings> & { user_id: string }) {
  return dbProxy({ table: 'user_settings', action: 'upsert', payload: settings })
}

// ── Admin ─────────────────────────────────────────────────
export async function getAllProfiles(): Promise<Profile[]> {
  try { return await dbProxy({ table: 'profiles', action: 'select', order: { col: 'created_at', asc: false } }) } catch { return [] }
}

export async function adminUpdateBalance(userId: string, newBalance: number) {
  return dbProxy({ table: 'profiles', action: 'update', payload: { balance: newBalance }, filters: [['id', userId]] })
}

export async function adminUpdateTransactionStatus(txId: string, status: 'Completed' | 'Failed') {
  return dbProxy({ table: 'transactions', action: 'update', payload: { status }, filters: [['id', txId]] })
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
  const res = await fetch(`/api/investments?userId=${userId}`)
  if (!res.ok) return []
  return res.json()
}

export async function insertInvestment(userId: string, amount: number): Promise<{ data: Investment | null; error: string | null }> {
  const res = await fetch('/api/investments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, amount }),
  })
  const json = await res.json()
  if (!res.ok) return { data: null, error: json.error ?? 'Failed' }
  return { data: json, error: null }
}

export async function completeInvestment(id: string, profitLoss: number): Promise<{ error: string | null }> {
  const res = await fetch('/api/investments', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, profitLoss }),
  })
  const json = await res.json()
  return { error: res.ok ? null : (json.error ?? 'Failed') }
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
