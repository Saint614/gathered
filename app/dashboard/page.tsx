import { type ReactNode } from 'react'
import Link from 'next/link'
import { getOwnerFarm } from '@/lib/supabase/getOwnerFarm'

export default async function DashboardPage(): Promise<ReactNode> {
  const farm = await getOwnerFarm()

  if (!farm) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to your dashboard</h1>
        <p className="mt-2 max-w-md text-gray-600">
          You don&apos;t have a farm listing yet. Farm listing requests aren&apos;t open yet —
          check back soon.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{farm.name}</h1>
        <Link href={`/farms/${farm.slug}`} className="text-sm font-medium underline">
          View listing
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/profile"
          className="rounded-lg border p-4 hover:bg-gray-50"
        >
          <h2 className="font-semibold">Profile</h2>
          <p className="mt-1 text-sm text-gray-600">
            Edit your farm&apos;s name, description, address, and contact info.
          </p>
        </Link>

        <Link href="/dashboard/hours" className="rounded-lg border p-4 hover:bg-gray-50">
          <h2 className="font-semibold">Hours</h2>
          <p className="mt-1 text-sm text-gray-600">Set your farm&apos;s operating hours.</p>
        </Link>
      </div>
    </div>
  )
}
