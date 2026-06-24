'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRef } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const clientRef = useRef<QueryClient | null>(null)
  if (clientRef.current === null) {
    clientRef.current = new QueryClient()
  }
  return (
    <QueryClientProvider client={clientRef.current}>
      {children}
    </QueryClientProvider>
  )
}
