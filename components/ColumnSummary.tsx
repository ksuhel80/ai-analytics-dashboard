import React from 'react'
import { ColumnInfo } from '@/types'
import { Hash, Type, Calendar, ToggleLeft } from 'lucide-react'

interface ColumnSummaryProps {
  column: ColumnInfo
}

export default function ColumnSummary({ column }: ColumnSummaryProps) {
  const getTypeIcon = () => {
    switch (column.type) {
      case 'number': return <Hash size={14} />
      case 'date': return <Calendar size={14} />
      case 'boolean': return <ToggleLeft size={14} />
      default: return <Type size={14} />
    }
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #f1f5f9',
      borderRadius: '12px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>{column.name}</h4>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '2px 8px',
          borderRadius: '6px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          fontSize: '0.625rem',
          fontWeight: 700,
          color: '#64748b',
          textTransform: 'uppercase'
        }}>
          {getTypeIcon()}
          {column.type}
        </div>
      </div>

      {/* Stats */}
      {column.type === 'number' && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Min', value: column.min },
            { label: 'Max', value: column.max },
            { label: 'Mean', value: column.mean?.toFixed(2) }
          ].map(stat => (
            <div key={stat.label} style={{
              backgroundColor: '#f1f5f9',
              padding: '4px 10px',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <span style={{ fontSize: '0.625rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569', fontFamily: 'monospace' }}>{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Counts */}
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.625rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Unique</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{column.unique_count}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.625rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Nulls</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: column.null_count > 0 ? '#ef4444' : '#10b981' }}>{column.null_count}</div>
        </div>
      </div>

      {/* Samples */}
      <div>
        <div style={{ fontSize: '0.625rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Samples</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {column.sample_values.map((val, i) => (
            <div key={i} style={{
              fontSize: '0.75rem',
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              padding: '2px 8px',
              borderRadius: '6px',
              color: '#64748b',
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {String(val)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
