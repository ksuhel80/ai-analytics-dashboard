"use client"

import React, { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import DashboardSidebar from '@/components/DashboardSidebar'
import { Dashboard } from '@/types'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [showSidebar, setShowSidebar] = useState(true)
  
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  useKeyboardShortcuts({
    onToggleSidebar: () => setShowSidebar(prev => !prev),
  })

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserEmail(user.email || '')
      fetchDashboards()
    }

    checkUser()
  }, [])

  const fetchDashboards = async () => {
    try {
      const response = await fetch('/api/dashboards')
      if (response.ok) {
        const data = await response.json()
        setDashboards(data)
      }
    } catch (error) {
      console.error('Error fetching dashboards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleNew = () => {
    router.push('/dashboard')
    // In dashboard home, this could trigger the uploader
  }

  const handleSelect = (id: string) => {
    setActiveId(id)
    router.push(`/dashboard/${id}`)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this dashboard?')) {
      await fetch(`/api/dashboards/${id}`, { method: 'DELETE' })
      fetchDashboards()
      if (activeId === id) router.push('/dashboard')
    }
  }

  const handlePin = async (id: string) => {
    await fetch(`/api/dashboards/${id}/pin`, { method: 'POST' })
    fetchDashboards()
  }

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3b82f6', borderRadius: '50%' }}></div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
      <div style={{ 
        width: showSidebar ? '260px' : '0', 
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        <DashboardSidebar
          dashboards={dashboards}
          activeId={activeId}
          onSelect={handleSelect}
          onNew={handleNew}
          onDelete={handleDelete}
          onPin={handlePin}
          userEmail={userEmail}
          onSignOut={handleSignOut}
        />
      </div>
      <main style={{ flex: 1, overflowY: 'auto', height: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
