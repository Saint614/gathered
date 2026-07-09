import { NextRequest } from 'next/server'
import { z } from 'zod'

const QuerySchema = z.object({
  q: z.string().min(1).max(200),
})

interface GeocodeResult {
  lat: number
  lng: number
}

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = req.nextUrl
  const parsed = QuerySchema.safeParse({ q: searchParams.get('q') })

  if (!parsed.success) {
    return Response.json({ error: 'Missing or invalid query parameter q' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'Geocoding not configured' }, { status: 500 })
  }

  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json')
  url.searchParams.set('address', parsed.data.q)
  url.searchParams.set('key', apiKey)
  // Bias results toward New England
  url.searchParams.set('region', 'us')
  url.searchParams.set('components', 'country:US')

  const res = await fetch(url.toString())
  if (!res.ok) {
    return Response.json({ error: 'Geocoding service error' }, { status: 502 })
  }

  const json = (await res.json()) as {
    status: string
    results: Array<{ geometry: { location: { lat: number; lng: number } } }>
  }

  if (json.status !== 'OK' || json.results.length === 0) {
    return Response.json({ error: 'Location not found' }, { status: 404 })
  }

  const { lat, lng } = json.results[0].geometry.location
  return Response.json({ lat, lng } satisfies GeocodeResult)
}
