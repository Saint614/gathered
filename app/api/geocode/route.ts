import { NextRequest } from 'next/server'
import { z } from 'zod'
import { geocodeAddress } from '@/lib/maps/geocode'

const QuerySchema = z.object({
  q: z.string().min(1).max(200),
})

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = req.nextUrl
  const parsed = QuerySchema.safeParse({ q: searchParams.get('q') })

  if (!parsed.success) {
    return Response.json({ error: 'Missing or invalid query parameter q' }, { status: 400 })
  }

  const coords = await geocodeAddress(parsed.data.q)
  if (!coords) {
    return Response.json({ error: 'Location not found' }, { status: 404 })
  }

  return Response.json(coords)
}
