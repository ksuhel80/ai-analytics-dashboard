"use client"

import React, { useState } from 'react'
import { Dashboard } from '@/types'
import { 
  Plus, 
  Search, 
  Pin, 
  Trash2, 
  LogOut, 
  BarChart3, 
  LayoutDashboard,
  ChevronRight,
  Clock
} from 'lucide-react'

interface DashboardSidebarProps {
  dashboards: Dashboard[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
  onPin: (id: string) => void
  userEmail: string
  onSignOut: () => void
}

export default function DashboardSidebar({
  dashboards,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onPin,
  userEmail,
  onSignOut
}: DashboardSidebarProps) {
  const [search, setSearch] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filtered = dashboards.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.dataset?.name.toLowerCase().includes(search.toLowerCase())
  )

  const pinned = filtered.filter(d => d.is_pinned)
  const recent = filtered.filter(d => !d.is_pinned)

  const renderItem = (d: Dashboard) => (
    <div
      key={d.id}
      onMouseEnter={() => setHoveredId(d.id)}
      onMouseLeave={() => setHoveredId(null)}
      onClick={() => onSelect(d.id)}
      style={{
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        backgroundColor: activeId === d.id ? '#1e293b' : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        position: 'relative',
        transition: 'all 0.2s',
        border: activeId === d.id ? '1px solid #334155' : '1px solid transparent'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ 
          fontSize: '0.875rem', 
          fontWeight: 600, 
          color: activeId === d.id ? '#fff' : '#cbd5e1',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '160px'
        }}>
          {d.name}
        </span>
        
        {hoveredId === d.id && (
          <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => onPin(d.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: d.is_pinned ? '#3b82f6' : '#64748b' }}
            >
              <Pin size={14} fill={d.is_pinned ? '#3b82f6' : 'none'} />
            </button>
            <button
              onClick={() => onDelete(d.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: activeId === d.id ? '#94a3b8' : '#64748b' }}>
        <Clock size={10} />
        <span>{new Date(d.updated_at).toLocaleDateString()}</span>
        <span>•</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {d.dataset?.name || 'No dataset'}
        </span>
      </div>
    </div>
  )

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      backgroundColor: '#0f172a',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      borderRight: '1px solid #1e293b'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '0 0.5rem' }}>
        <div style={{ backgroundColor: '#3b82f6', padding: '0.5rem', borderRadius: '10px' }}>
          <BarChart3 size={24} color="#fff" />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em' }}>DataAI</span>
      </div>

      {/* New Button */}
      <button
        onClick={onNew}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '10px',
          backgroundColor: '#3b82f6',
          color: '#fff',
          border: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
        }}
      >
        <Plus size={18} />
        New Dashboard
      </button>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={16} color="#64748b" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search dashboards..."
          style={{
            width: '100%',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '0.625rem 0.75rem 0.625rem 2.5rem',
            color: '#fff',
            fontSize: '0.875rem',
            outline: 'none'
          }}
        />
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {pinned.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', padding: '0 0.5rem' }}>
              Pinned
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {pinned.map(renderItem)}
            </div>
          </div>
        )}

        <div>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', padding: '0 0.5rem' }}>
            Recent Dashboards
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {recent.map(renderItem)}
          </div>
        </div>
      </div>

      {/* User */}
      <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
            {userEmail[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail.split('@')[0]}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</div>
          </div>
          <button
            onClick={onSignOut}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
