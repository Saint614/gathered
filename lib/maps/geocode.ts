export interface GeocodeCoords {
  lat: number
  lng: number
}

export async function geocodeAddress(query: string): Promise<GeocodeCoords | null> {
  const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY
  if (!apiKey) return null

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json')
    url.searchParams.set('address', query)
    url.searchParams.set('key', apiKey)
    // Bias results toward New England
    url.searchParams.set('region', 'us')
    url.searchParams.set('components', 'country:US')

    const res = await fetch(url.toString())
    if (!res.ok) return null

    const json = (await res.json()) as {
      status: string
      results: Array<{ geometry: { location: { lat: number; lng: number } } }>
    }

    if (json.status !== 'OK' || json.results.length === 0) return null

    const { lat, lng } = json.results[0].geometry.location
    return { lat, lng }
  } catch {
    return null
  }
}
