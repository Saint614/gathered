import { type ReactNode } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getOwnerFarm } from '@/lib/supabase/getOwnerFarm'
import { HoursForm, type HoursFormRow } from './HoursForm'

export default async function HoursPage(): Promise<ReactNode> {
  const farm = await getOwnerFarm()

  if (!farm) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-gray-600">You don&apos;t have a farm listing yet — nothing to edit.</p>
        <Link href="/dashboard" className="text-sm font-medium underline">
          Back to dashboard
        </Link>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: existingHours } = await supabase
    .from('farm_hours')
    .select('day_of_week, open_time, close_time, note')
    .eq('farm_id', farm.id)
    .order('day_of_week')

  const byDay = new Map((existingHours ?? []).map((row) => [row.day_of_week, row]))

  const initialHours: HoursFormRow[] = Array.from({ length: 7 }, (_, day) => {
    const row = byDay.get(day)
    return {
      day_of_week: day,
      is_open: Boolean(row?.open_time && row?.close_time),
      open_time: row?.open_time?.slice(0, 5) ?? null,
      close_time: row?.close_time?.slice(0, 5) ?? null,
      note: row?.note ?? '',
    }
  })

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Edit hours</h1>
      <HoursForm farmId={farm.id} initialHours={initialHours} />
    </div>
  )
}
