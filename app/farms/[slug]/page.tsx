import { cache } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { FarmDetail, FarmTypeEnum, FarmHour, FarmProduct, FarmEvent } from '@/lib/types/farm'
import { FarmHeader } from '@/components/farms/FarmHeader'
import { FarmHours } from '@/components/farms/FarmHours'
import { FarmEventCard } from '@/components/farms/FarmEventCard'

// Deduplicate the farm query between generateMetadata and the page render
const getFarm = cache(async (slug: string): Promise<FarmDetail | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('farms')
    .select('id, name, slug, description, address, city, state, zip, cover_image_url, avatar_url, phone, website_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  if (error) throw error
  return data
})

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const farm = await getFarm(slug)
  if (!farm) return { title: 'Farm Not Found — FarmFolk' }

  const description = farm.description
    ? farm.description.slice(0, 160)
    : `${farm.name} in ${farm.city}, ${farm.state}`

  return {
    title: `${farm.name} — FarmFolk`,
    description,
  }
}

export default async function FarmDetailPage(
  { params }: { params: Promise<{ slug: string }> }
): Promise<React.ReactElement> {
  const { slug } = await params
  const farm = await getFarm(slug)
  if (!farm) notFound()

  const supabase = await createClient()

  // Run the remaining queries in parallel
  const [
    { data: typeTagRows },
    { data: featuresRow },
    { data: hoursRows },
    { data: productRows },
    { data: eventRows },
  ] = await Promise.all([
    supabase
      .from('farm_type_tags')
      .select('type')
      .eq('farm_id', farm.id),
    supabase
      .from('farm_features')
      .select('open_to_public, has_farm_store, offers_csa')
      .eq('farm_id', farm.id)
      .maybeSingle(),
    supabase
      .from('farm_hours')
      .select('day_of_week, open_time, close_time, note')
      .eq('farm_id', farm.id)
      .order('day_of_week'),
    supabase
      .from('farm_products')
      .select('id, name, category, note, in_season')
      .eq('farm_id', farm.id)
      .order('name'),
    supabase
      .from('farm_events')
      .select('id, title, event_type, starts_at, ends_at, description, external_url')
      .eq('farm_id', farm.id)
      .eq('is_cancelled', false)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at'),
  ])

  const types = (typeTagRows ?? []).map((r) => r.type as FarmTypeEnum)
  const openToPublic = featuresRow?.open_to_public ?? false
  const hours = (hoursRows ?? []) as FarmHour[]
  const products = (productRows ?? []) as FarmProduct[]
  const events = (eventRows ?? []) as FarmEvent[]

  return (
    <div className="min-h-screen bg-white">
      {/* Back nav */}
      <div className="px-4 pt-4 md:px-8">
        <Link
          href="/search"
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Back to map
        </Link>
      </div>

      {/* 1. Cover image */}
      <div className="relative w-full h-48 md:h-72 lg:h-80 bg-green-700 mt-3">
        {farm.cover_image_url && (
          <Image
            src={farm.cover_image_url}
            alt={`${farm.name} cover photo`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* 2. Farm header */}
      <FarmHeader farm={farm} types={types} openToPublic={openToPublic} />

      {/* 3. About */}
      {farm.description && (
        <section className="px-4 py-6 md:px-8 border-t border-stone-100">
          <h2 className="text-lg font-semibold text-stone-900 mb-2">About</h2>
          <p className="text-stone-600 leading-relaxed">{farm.description}</p>
        </section>
      )}

      {/* 4. Hours */}
      {hours.length > 0 && <FarmHours hours={hours} />}

      {/* 5. Products */}
      {products.length > 0 && (
        <section className="px-4 py-6 md:px-8 border-t border-stone-100">
          <h2 className="text-lg font-semibold text-stone-900 mb-3">Products Available</h2>
          <ul className="space-y-2">
            {products.map((p) => (
              <li key={p.id} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                <span>
                  <span className="font-medium text-stone-800">{p.name}</span>
                  {p.category && (
                    <span className="ml-1.5 text-stone-400 text-xs">{p.category}</span>
                  )}
                  {p.in_season && (
                    <span className="ml-1.5 inline-block px-1 py-0 rounded text-[10px] font-medium bg-green-100 text-green-700">
                      In season
                    </span>
                  )}
                  {p.note && (
                    <span className="block text-stone-500 text-xs mt-0.5">{p.note}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 6. Upcoming events */}
      <section className="px-4 py-6 md:px-8 border-t border-stone-100">
        <h2 className="text-lg font-semibold text-stone-900 mb-3">Upcoming Events</h2>
        {events.length > 0 ? (
          <div className="space-y-2">
            {events.map((e) => (
              <FarmEventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-stone-400">No upcoming events.</p>
        )}
      </section>
    </div>
  )
}
