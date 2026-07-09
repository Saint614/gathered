'use client'

import { Map, AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps'
import type { FarmNearResult } from '@/lib/types/farm'
import { parseLatLng } from '@/lib/types/farm'
import { FarmMapPin } from './FarmMapPin'
import { useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface FarmMapProps {
  farms: FarmNearResult[]
  centerLat: number
  centerLng: number
  selectedFarmId: string | null
  onFarmSelect: (id: string | null) => void
}

interface MarkerWithInfoProps {
  farm: FarmNearResult
  lat: number
  lng: number
  selected: boolean
  onSelect: (id: string) => void
}

function MarkerWithInfo({ farm, lat, lng, selected, onSelect }: MarkerWithInfoProps): React.ReactElement | null {
  const [markerRef, marker] = useAdvancedMarkerRef()

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat, lng }}
        onClick={() => onSelect(farm.id)}
        zIndex={selected ? 10 : 1}
      >
        <FarmMapPin selected={selected} />
      </AdvancedMarker>

      {selected && marker && (
        <InfoWindow
          anchor={marker}
          onCloseClick={() => onSelect(farm.id)}
          headerDisabled
        >
          <div className="max-w-[200px]">
            {farm.cover_image_url && (
              <div className="relative w-full h-24 rounded-t overflow-hidden -mt-3 -mx-3 mb-2" style={{ width: 'calc(100% + 1.5rem)' }}>
                <Image
                  src={farm.cover_image_url}
                  alt={farm.name}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
            )}
            <p className="font-semibold text-stone-900 text-sm leading-tight">{farm.name}</p>
            <p className="text-stone-500 text-xs mt-0.5">
              {farm.city}, {farm.state}
            </p>
            {farm.distance_km != null && (
              <p className="text-stone-400 text-xs mt-0.5">
                {farm.distance_km.toFixed(1)} km away
              </p>
            )}
            <Link
              href={`/farms/${farm.slug}`}
              className="mt-2 inline-block text-xs font-medium text-green-700 hover:underline"
            >
              View farm →
            </Link>
          </div>
        </InfoWindow>
      )}
    </>
  )
}

export function FarmMap({
  farms,
  centerLat,
  centerLng,
  selectedFarmId,
  onFarmSelect,
}: FarmMapProps): React.ReactElement {
  const handleSelect = useCallback(
    (id: string) => {
      onFarmSelect(selectedFarmId === id ? null : id)
    },
    [selectedFarmId, onFarmSelect]
  )

  return (
    <Map
      defaultCenter={{ lat: centerLat, lng: centerLng }}
      center={{ lat: centerLat, lng: centerLng }}
      defaultZoom={11}
      mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID'}
      gestureHandling="greedy"
      disableDefaultUI={false}
      className="w-full h-full"
    >
      {farms.map((farm) => {
        const pos = parseLatLng(farm.location)
        if (!pos) return null
        return (
          <MarkerWithInfo
            key={farm.id}
            farm={farm}
            lat={pos.lat}
            lng={pos.lng}
            selected={selectedFarmId === farm.id}
            onSelect={handleSelect}
          />
        )
      })}
    </Map>
  )
}
