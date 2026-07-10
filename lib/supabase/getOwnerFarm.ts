import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface OwnerFarm {
  id: string
  name: string
  slug: string
  description: string | null
  address: string
  city: string
  state: string
  zip: string
  phone: string | null
  email: string | null
  website_url: string | null
  cover_image_url: string | null
  avatar_url: string | null
}

export async function getOwnerFarm(): Promise<OwnerFarm | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: farm, error } = await supabase
    .from('farms')
    .select(
      'id, name, slug, description, address, city, state, zip, phone, email, website_url, cover_image_url, avatar_url'
    )
    .eq('owner_id', user.id)
    .maybeSingle()

  if (error) throw error
  return farm
}
