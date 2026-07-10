import { type ReactNode } from 'react'
import Link from 'next/link'
import { getOwnerFarm } from '@/lib/supabase/getOwnerFarm'
import { ProfileForm } from './ProfileForm'

export default async function ProfilePage(): Promise<ReactNode> {
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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Edit profile</h1>
      <ProfileForm farm={farm} />
    </div>
  )
}
