import type { FarmEvent } from '@/lib/types/farm'
import { formatEventDate } from '@/lib/utils/farmTypes'

const EVENT_TYPE_LABELS: Record<string, string> = {
  open_farm_day: 'Open Farm Day',
  farmers_market: 'Farmers Market',
  food_truck: 'Food Truck',
  u_pick: 'U-Pick',
  csa_pickup: 'CSA Pickup',
  workshop: 'Workshop',
  other: 'Event',
}

interface FarmEventCardProps {
  event: FarmEvent
}

export function FarmEventCard({ event }: FarmEventCardProps): React.ReactElement {
  const label = event.event_type ? (EVENT_TYPE_LABELS[event.event_type] ?? event.event_type) : null
  const snippet = event.description
    ? event.description.length > 150
      ? event.description.slice(0, 147) + '…'
      : event.description
    : null

  const inner = (
    <div className="flex flex-col gap-1">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-stone-900 text-sm leading-snug">{event.title}</p>
        {label && (
          <span className="shrink-0 inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800">
            {label}
          </span>
        )}
      </div>
      <p className="text-xs text-stone-500">{formatEventDate(event.starts_at)}</p>
      {snippet && <p className="text-sm text-stone-600 mt-0.5">{snippet}</p>}
    </div>
  )

  if (event.external_url) {
    return (
      <a
        href={event.external_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-3 rounded-lg border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors"
      >
        {inner}
      </a>
    )
  }

  return (
    <div className="p-3 rounded-lg border border-stone-200">
      {inner}
    </div>
  )
}
