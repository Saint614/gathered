import { type ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/auth/SignOutButton'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/profile', label: 'Profile' },
  { href: '/dashboard/hours', label: 'Hours' },
] as const

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}): Promise<ReactNode> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex flex-row items-center justify-between gap-2 border-b p-4 md:w-56 md:flex-col md:items-stretch md:justify-start md:border-b-0 md:border-r md:p-6">
        <nav className="flex flex-row gap-2 md:flex-col md:gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <SignOutButton />
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  )
}
