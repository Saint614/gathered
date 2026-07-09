'use client'

import Image from 'next/image'
import type { FarmNearResult } from '@/lib/types/farm'

const TYPE_LABELS: Record<string, string> = {
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

interface FarmCardProps {
  farm: FarmNearResult & { types?: string[] }
  selected?: boolean
  onClick: () => void
}

export function FarmCard({ farm, selected = false, onClick }: FarmCardProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full text-left flex gap-3 p-3 rounded-lg border transition-colors duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600',
        selected
          ? 'border-green-600 bg-green-50'
          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50',
      ].join(' ')}
    >
      <div className="relative shrink-0 w-16 h-16 rounded-md overflow-hidden bg-stone-100">
        {farm.avatar_url ? (
          <Image
            src={farm.avatar_url}
            alt={farm.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-8 h-8 fill-stone-300"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-stone-900 truncate text-sm">{farm.name}</p>
        <p className="text-stone-500 text-xs mt-0.5">
          {farm.city}, {farm.state}
        </p>
        {farm.distance_km != null && (
          <p className="text-stone-400 text-xs mt-0.5">
            {farm.distance_km < 1
              ? `${Math.round(farm.distance_km * 1000)} m away`
              : `${farm.distance_km.toFixed(1)} km away`}
          </p>
        )}
        {farm.types && farm.types.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {farm.types.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800"
              >
                {TYPE_LABELS[t] ?? t}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}
