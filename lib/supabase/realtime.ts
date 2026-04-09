import { createClient } from './client'
import type { RealtimeChannel } from '@supabase/supabase-js'

type Event = 'INSERT' | 'UPDATE' | '*'

/**
 * Subscribe to Postgres changes on a table, optionally filtered by a column.
 * Returns an unsubscribe function — call it in useEffect cleanup.
 */
export function subscribeToTable<T extends Record<string, unknown>>(
  table: string,
  events: Event | Event[],
  callback: (row: T, event: Event) => void,
  filter?: { col: string; val: string },
): () => void {
  const sb = createClient()
  const channelName = filter
    ? `${table}:${filter.col}:${filter.val}`
    : `${table}:all`

  const channel: RealtimeChannel = sb.channel(channelName)
  const evts = Array.isArray(events) ? events : [events]

  evts.forEach(event => {
    channel.on(
      'postgres_changes' as any,
      {
        event,
        schema: 'public',
        table,
        ...(filter ? { filter: `${filter.col}=eq.${filter.val}` } : {}),
      },
      (payload: any) => callback(payload.new as T, event),
    )
  })

  channel.subscribe()
  return () => { sb.removeChannel(channel) }
}
