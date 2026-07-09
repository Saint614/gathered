'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { geocodeAddress } from '@/lib/maps/geocode'
import {
  UpdateFarmProfileServerSchema,
  type UpdateFarmProfileInput,
} from '@/lib/validation/farm'

export interface UpdateFarmProfileResult {
  success: boolean
  error?: string
  fieldErrors?: Partial<Record<keyof UpdateFarmProfileInput, string>>
  warning?: string
}

export async function updateFarmProfile(
  farmId: string,
  input: UpdateFarmProfileInput
): Promise<UpdateFarmProfileResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const parsed = UpdateFarmProfileServerSchema.safeParse(input)
  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors
    const fieldErrors: Partial<Record<keyof UpdateFarmProfileInput, string>> = {}
    for (const [field, messages] of Object.entries(flattened)) {
      if (messages && messages.length > 0) {
        fieldErrors[field as keyof UpdateFarmProfileInput] = messages[0]
      }
    }
    return { success: false, fieldErrors }
  }
  const data = parsed.data

  const { data: farm, error: fetchError } = await supabase
    .from('farms')
    .select('id, slug, address, city, state, zip')
    .eq('id', farmId)
    .eq('owner_id', user.id)
    .maybeSingle()

  if (fetchError || !farm) {
    return { success: false, error: 'Farm not found' }
  }

  const addressChanged =
    farm.address !== data.address ||
    farm.city !== data.city ||
    farm.state !== data.state ||
    farm.zip !== data.zip

  let warning: string | undefined
  let location: string | undefined

  if (addressChanged) {
    const fullAddress = `${data.address}, ${data.city}, ${data.state} ${data.zip}`
    const coords = await geocodeAddress(fullAddress)
    if (coords) {
      location = `SRID=4326;POINT(${coords.lng} ${coords.lat})`
    } else {
      warning = "Saved, but we couldn't locate the new address on the map"
    }
  }

  const { error: updateError } = await supabase
    .from('farms')
    .update({
      name: data.name,
      description: data.description,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      phone: data.phone,
      email: data.email,
      website_url: data.website_url,
      cover_image_url: data.cover_image_url,
      avatar_url: data.avatar_url,
      updated_at: new Date().toISOString(),
      ...(location ? { location } : {}),
    })
    .eq('id', farmId)

  if (updateError) {
    console.error('updateFarmProfile: failed to update farm', updateError)
    return { success: false, error: 'Failed to save changes' }
  }

  revalidatePath(`/farms/${farm.slug}`)
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profile')

  return { success: true, warning }
}
