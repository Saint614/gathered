import Image from 'next/image'
import type { FarmDetail, FarmTypeEnum } from '@/lib/types/farm'
import { TYPE_LABELS } from '@/lib/utils/farmTypes'

interface FarmHeaderProps {
  farm: FarmDetail
  types: FarmTypeEnum[]
  openToPublic: boolean
}

export function FarmHeader({ farm, types, openToPublic }: FarmHeaderProps): React.ReactElement {
  const directionsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      `${farm.address}, ${farm.city}, ${farm.state} ${farm.zip}`
    )}`

  return (
    <div className="px-4 py-6 md:px-8">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-stone-100 border-2 border-white shadow-sm">
          {farm.avatar_url ? (
            <Image
              src={farm.avatar_url}
              alt={farm.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 fill-green-600">
                <path d="M12 3L2 12h3v8h6v-5h2v5h6v-8h3L12 3z" />
              </svg>
            </div>
          )}
        </div>

        {/* Name + location */}
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 leading-tight">{farm.name}</h1>
          <p className="text-stone-500 mt-1">{farm.city}, {farm.state}</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {openToPublic && (
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                Open to Public
              </span>
            )}
            {types.map((t) => (
              <span
                key={t}
                className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800"
              >
                {TYPE_LABELS[t] ?? t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex flex-wrap gap-3 mt-4">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M21.71 11.29l-9-9a1 1 0 00-1.42 0l-9 9a1 1 0 000 1.42l9 9a1 1 0 001.42 0l9-9a1 1 0 000-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 011-1h5V7.5l3.5 3.5-3.5 3.5z" />
          </svg>
          Get Directions
        </a>
        {farm.website_url && (
          <a
            href={farm.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-sm font-medium hover:border-stone-400 hover:bg-stone-50 transition-colors"
          >
            Visit Website
          </a>
        )}
        {farm.phone && (
          <a
            href={`tel:${farm.phone}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-sm font-medium hover:border-stone-400 hover:bg-stone-50 transition-colors"
          >
            {farm.phone}
          </a>
        )}
      </div>
    </div>
  )
}
