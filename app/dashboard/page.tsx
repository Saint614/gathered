import { type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SignOutButton } from '@/components/auth/SignOutButton'

export default async function DashboardPage(): Promise<ReactNode> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to your dashboard</h1>
        <SignOutButton />
      </div>
      <p className="mt-2 text-gray-600">{user.email}</p>
    </div>
  )
}
