export const TYPE_LABELS: Record<string, string> = {
  produce: 'Produce',
  meat: 'Meat',
  dairy: 'Dairy',
  honey: 'Honey',
  flowers: 'Flowers',
  orchard: 'Orchard',
  u_pick: 'U-Pick',
  csa: 'CSA',
  farmers_market: 'Farmers Market',
  farm_store: 'Farm Store',
}

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

// "09:00:00" → "9:00 AM"
export function formatTime(t: string | null | undefined): string {
  if (!t) return 'Closed'
  const [hStr, mStr] = t.split(':')
  const h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

// "2026-07-12T10:00:00" → "Sat Jul 12 · 10:00 AM"  (UTC — events are stored without tz offset for now)
export function formatEventDate(isoString: string): string {
  const d = new Date(isoString)
  const day = DAY_NAMES[d.getUTCDay()]
  const month = MONTHS[d.getUTCMonth()]
  const date = d.getUTCDate()
  const h = d.getUTCHours()
  const m = d.getUTCMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${day} ${month} ${date} · ${hour}:${String(m).padStart(2, '0')} ${ampm}`
}
