'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'
import { useMapStore } from '@/lib/store/useMapStore'
import { useLocation } from '@/lib/hooks/useLocation'
import { useFarmsNear } from '@/lib/hooks/useFarmsNear'
import { FarmMap } from '@/components/farms/FarmMap'
import { FarmCard } from '@/components/farms/FarmCard'
import type { FarmTypeEnum } from '@/lib/types/farm'

const WESTPORT_MA = { lat: 41.5823, lng: -71.0773 }

const FILTER_CHIPS: { label: string; type: FarmTypeEnum | 'open_to_public' }[] = [
  { label: 'Produce', type: 'produce' },
  { label: 'Meat', type: 'meat' },
  { label: 'Farmers Market', type: 'farmers_market' },
  { label: 'Open to Public', type: 'open_to_public' },
]

export default function SearchPage(): React.ReactElement {
  const { lat, lng, locationStatus } = useLocation()

  const filterTypes = useMapStore((s) => s.filterTypes) as FarmTypeEnum[]
  const openToPublicOnly = useMapStore((s) => s.openToPublicOnly)
  const radiusKm = useMapStore((s) => s.radiusKm)
  const toggleFilterType = useMapStore((s) => s.toggleFilterType)
  const setOpenToPublicOnly = useMapStore((s) => s.setOpenToPublicOnly)
  const selectedFarmId = useMapStore((s) => s.selectedFarmId)
  const setSelectedFarmId = useMapStore((s) => s.setSelectedFarmId)
  const setLocation = useMapStore((s) => s.setLocation)
  const setLocationStatus = useMapStore((s) => s.setLocationStatus)

  const centerLat = lat ?? WESTPORT_MA.lat
  const centerLng = lng ?? WESTPORT_MA.lng

  const { data: farms = [], isLoading, error } = useFarmsNear({
    lat: centerLat,
    lng: centerLng,
    radiusKm,
    filterTypes,
    openToPublicOnly,
  })

  // Zip/town search
  const [locationQuery, setLocationQuery] = useState('')
  const [geocodeError, setGeocodeError] = useState<string | null>(null)
  const [isGeocoding, setIsGeocoding] = useState(false)

  const handleLocationSearch = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const q = locationQuery.trim()
      if (!q) return

      setGeocodeError(null)
      setIsGeocoding(true)
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`)
        if (!res.ok) {
          const body = (await res.json()) as { error?: string }
          setGeocodeError(body.error ?? 'Location not found')
          return
        }
        const { lat: newLat, lng: newLng } = (await res.json()) as { lat: number; lng: number }
        setLocation(newLat, newLng)
        setLocationStatus('granted')
        setLocationQuery('')
      } catch {
        setGeocodeError('Could not reach geocoding service')
      } finally {
        setIsGeocoding(false)
      }
    },
    [locationQuery, setLocation, setLocationStatus]
  )

  const retryGeolocation = useCallback(() => {
    setLocationStatus('idle')
  }, [setLocationStatus])

  // Scroll selected card into view
  const sidebarRef = useRef<HTMLDivElement>(null)
  const selectedCardRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (selectedFarmId && selectedCardRef.current) {
      selectedCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedFarmId])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  return (
    <APIProvider apiKey={apiKey}>
      <div className="flex flex-col h-screen">
        {/* Location denied banner */}
        {locationStatus === 'denied' && (
          <div className="flex items-center gap-3 px-4 py-2 bg-amber-50 border-b border-amber-200 text-sm text-amber-800 shrink-0">
            <span>Showing farms near Westport, MA — allow location for farms near you.</span>
            <button
              type="button"
              onClick={retryGeolocation}
              className="shrink-0 font-medium underline hover:no-underline"
            >
              Use my location
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          {/* Sidebar */}
          <aside className="flex flex-col w-full md:w-80 lg:w-96 shrink-0 border-b md:border-b-0 md:border-r border-stone-200 bg-white">
            {/* Filter chips + zip search */}
            <div className="p-3 border-b border-stone-200 space-y-2 shrink-0">
              <div className="flex flex-wrap gap-2">
                {FILTER_CHIPS.map((chip) => {
                  const active =
                    chip.type === 'open_to_public'
                      ? openToPublicOnly
                      : filterTypes.includes(chip.type as FarmTypeEnum)

                  return (
                    <button
                      key={chip.type}
                      type="button"
                      onClick={() => {
                        if (chip.type === 'open_to_public') {
                          setOpenToPublicOnly(!openToPublicOnly)
                        } else {
                          toggleFilterType(chip.type)
                        }
                      }}
                      className={[
                        'px-3 py-1 rounded-full text-sm font-medium border transition-colors',
                        active
                          ? 'bg-green-700 text-white border-green-700'
                          : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400',
                      ].join(' ')}
                    >
                      {chip.label}
                    </button>
                  )
                })}
              </div>

              {/* Zip/town search */}
              <form onSubmit={handleLocationSearch} className="flex gap-2">
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Search by zip or town…"
                  className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <button
                  type="submit"
                  disabled={isGeocoding || !locationQuery.trim()}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-800 disabled:opacity-50 transition-colors"
                >
                  {isGeocoding ? '…' : 'Go'}
                </button>
              </form>
              {geocodeError && (
                <p className="text-xs text-red-600">{geocodeError}</p>
              )}
            </div>

            {/* Farm list */}
            <div ref={sidebarRef} className="flex-1 overflow-y-auto p-2 space-y-2">
              {isLoading && (
                <div className="flex items-center justify-center py-12 text-stone-400 text-sm">
                  Loading farms…
                </div>
              )}
              {error && !isLoading && (
                <div className="py-12 text-center text-sm text-red-600">
                  Could not load farms. Please try again.
                </div>
              )}
              {!isLoading && !error && farms.length === 0 && (
                <div className="py-12 text-center text-sm text-stone-400">
                  No farms found in this area.
                </div>
              )}
              {farms.map((farm) => (
                <div
                  key={farm.id}
                  ref={selectedFarmId === farm.id ? selectedCardRef : undefined}
                >
                  <FarmCard
                    farm={farm}
                    selected={selectedFarmId === farm.id}
                    onClick={() =>
                      setSelectedFarmId(selectedFarmId === farm.id ? null : farm.id)
                    }
                  />
                </div>
              ))}
            </div>
          </aside>

          {/* Map */}
          <main className="flex-1 min-h-[50vh] md:min-h-0 relative">
            <FarmMap
              farms={farms}
              centerLat={centerLat}
              centerLng={centerLng}
              selectedFarmId={selectedFarmId}
              onFarmSelect={setSelectedFarmId}
            />
          </main>
        </div>
      </div>
    </APIProvider>
  )
}
