import type { FarmHour } from '@/lib/types/farm'
import { DAY_NAMES, formatTime } from '@/lib/utils/farmTypes'

interface FarmHoursProps {
  hours: FarmHour[]
}

export function FarmHours({ hours }: FarmHoursProps): React.ReactElement {
  // Sort by day_of_week so Sun → Sat
  const sorted = [...hours].sort((a, b) => a.day_of_week - b.day_of_week)

  return (
    <section className="px-4 py-6 md:px-8 border-t border-stone-100">
      <h2 className="text-lg font-semibold text-stone-900 mb-3">Hours</h2>
      <dl className="space-y-1.5">
        {sorted.map((row) => (
          <div key={row.day_of_week} className="flex justify-between text-sm">
            <dt className="w-12 font-medium text-stone-700 shrink-0">
              {DAY_NAMES[row.day_of_week]}
            </dt>
            <dd className="text-stone-500 text-right">
              {row.open_time && row.close_time
                ? `${formatTime(row.open_time)} – ${formatTime(row.close_time)}`
                : 'Closed'}
              {row.note && (
                <span className="ml-1.5 text-stone-400 text-xs">({row.note})</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
