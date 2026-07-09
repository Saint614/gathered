'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  UpdateFarmHoursServerSchema,
  type UpdateFarmHoursInput,
} from '@/lib/validation/farm'

export interface UpdateFarmHoursResult {
  success: boolean
  error?: string
}

export async function updateFarmHours(
  farmId: string,
  input: UpdateFarmHoursInput
): Promise<UpdateFarmHoursResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const parsed = UpdateFarmHoursServerSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Invalid hours data' }
  }
  const data = parsed.data

  const { data: farm, error: fetchError } = await supabase
    .from('farms')
    .select('id, slug')
    .eq('id', farmId)
    .eq('owner_id', user.id)
    .maybeSingle()

  if (fetchError || !farm) {
    return { success: false, error: 'Farm not found' }
  }

  const { error: deleteError } = await supabase
    .from('farm_hours')
    .delete()
    .eq('farm_id', farmId)

  if (deleteError) {
    console.error('updateFarmHours: failed to delete existing hours', deleteError)
    return { success: false, error: 'Failed to update hours' }
  }

  // No transaction available without an RPC — if the insert below fails, the
  // farm is briefly left with zero hours rows. Acceptable for MVP scale.
  const rows = data.hours.map((h) => ({
    farm_id: farmId,
    day_of_week: h.day_of_week,
    open_time: h.is_open ? h.open_time : null,
    close_time: h.is_open ? h.close_time : null,
    note: h.note,
  }))

  const { error: insertError } = await supabase.from('farm_hours').insert(rows)

  if (insertError) {
    console.error('updateFarmHours: failed to insert new hours', insertError)
    return { success: false, error: 'Failed to save new hours' }
  }

  revalidatePath(`/farms/${farm.slug}`)
  revalidatePath('/dashboard/hours')

  return { success: true }
}
