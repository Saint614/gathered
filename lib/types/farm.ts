import type { Database } from '@/lib/supabase/types'

export type FarmTypeEnum = Database['public']['Enums']['farm_type_enum']

// ── Detail page types ──────────────────────────────────────────────────────

export interface FarmDetail {
  id: string
  name: string
  slug: string
  description: string | null
  address: string
  city: string
  state: string
  zip: string
  cover_image_url: string | null
  avatar_url: string | null
  phone: string | null
  website_url: string | null
}

export interface FarmHour {
  day_of_week: number
  open_time: string | null
  close_time: string | null
  note: string | null
}

export interface FarmProduct {
  id: string
  name: string
  category: string | null
  note: string | null
  in_season: boolean | null
}

export interface FarmEvent {
  id: string
  title: string
  event_type: string | null
  starts_at: string
  ends_at: string | null
  description: string | null
  external_url: string | null
}

export interface FarmNearResult {
  id: string
  name: string
  slug: string
  city: string
  state: string
  cover_image_url: string | null
  avatar_url: string | null
  location: unknown
  distance_km: number
}

// PostgREST returns PostGIS geography columns as EWKB hex strings, e.g.:
// "0101000020E6100000956588635DC451C018265305A3CA4440"
// Layout: 1B order | 4B type (with optional SRID flag 0x20000000) | [4B SRID] | 8B X (lng) | 8B Y (lat)
function parseWKBPoint(hex: string): { lat: number; lng: number } | null {
  if (typeof hex !== 'string' || hex.length < 42) return null
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  const view = new DataView(bytes.buffer)
  const le = bytes[0] === 1
  const typeVal = view.getUint32(1, le)
  const hasSrid = (typeVal & 0x20000000) !== 0
  const offset = 1 + 4 + (hasSrid ? 4 : 0)
  if (bytes.length < offset + 16) return null
  return {
    lng: view.getFloat64(offset, le),
    lat: view.getFloat64(offset + 8, le),
  }
}

export function parseLatLng(location: unknown): { lat: number; lng: number } | null {
  if (!location) return null
  // WKB hex string (what PostgREST actually returns for geography columns)
  if (typeof location === 'string') return parseWKBPoint(location)
  // GeoJSON object fallback
  if (typeof location === 'object') {
    const point = location as { type?: string; coordinates?: number[] }
    if (point.type === 'Point' && Array.isArray(point.coordinates) && point.coordinates.length >= 2) {
      return { lat: point.coordinates[1], lng: point.coordinates[0] }
    }
  }
  return null
}
