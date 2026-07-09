import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { FarmNearResult, FarmTypeEnum } from '@/lib/types/farm'

interface UseFarmsNearParams {
  lat: number
  lng: number
  radiusKm?: number
  filterTypes?: FarmTypeEnum[]
  openToPublicOnly?: boolean
}

const FARM_QUERY_KEYS = {
  near: (lat: number, lng: number, radiusKm: number, filterTypes: FarmTypeEnum[], openToPublicOnly: boolean) =>
    ['farms', 'near', lat, lng, radiusKm, filterTypes, openToPublicOnly] as const,
}

async function fetchFarmsNear({
  lat,
  lng,
  radiusKm = 50,
  filterTypes = [],
  openToPublicOnly = false,
}: UseFarmsNearParams): Promise<FarmNearResult[]> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_farms_near', {
    user_lat: lat,
    user_lng: lng,
    radius_km: radiusKm,
    filter_types: filterTypes.length > 0 ? filterTypes : undefined,
    open_to_public_only: openToPublicOnly,
  })

  if (error) throw error
  return (data ?? []) as FarmNearResult[]
}

export function useFarmsNear({
  lat,
  lng,
  radiusKm = 50,
  filterTypes = [],
  openToPublicOnly = false,
}: UseFarmsNearParams) {
  return useQuery({
    queryKey: FARM_QUERY_KEYS.near(lat, lng, radiusKm, filterTypes, openToPublicOnly),
    queryFn: () => fetchFarmsNear({ lat, lng, radiusKm, filterTypes, openToPublicOnly }),
    enabled: isFinite(lat) && isFinite(lng),
  })
}
