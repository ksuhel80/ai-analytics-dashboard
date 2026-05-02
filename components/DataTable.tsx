"use client"

import React, { useState, useMemo } from 'react'
import { ColumnInfo } from '@/types'
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown, 
  Type, 
  Hash, 
  Calendar, 
  ToggleLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface DataTableProps {
  data: Record<string, any>[]
  columns: ColumnInfo[]
  maxRows?: number
}

const PAGE_SIZE = 50

export default function DataTable({ data = [], columns = [], maxRows }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({
    key: '',
    direction: null
  })

  // 🔍 Debug
  console.log("DataTable data:", data)
  console.log("Columns:", columns)

  // 🔥 Case-insensitive value getter
  const getValue = (obj: any, key: string) => {
    const foundKey = Object.keys(obj).find(
      k => k.toLowerCase() === key.toLowerCase()
    )
    return foundKey ? obj[foundKey] : undefined
  }

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null
    }
    setSortConfig({ key, direction })
    setCurrentPage(1)
  }

  const sortedData = useMemo(() => {
    let sortableItems = [...data]
    if (maxRows) sortableItems = sortableItems.slice(0, maxRows)

    if (sortConfig.direction !== null) {
      sortableItems.sort((a, b) => {
        const aVal = getValue(a, sortConfig.key)
        const bVal = getValue(b, sortConfig.key)

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return sortableItems
  }, [data, sortConfig, maxRows])

  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE)

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return sortedData.slice(start, start + PAGE_SIZE)
  }, [sortedData, currentPage])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'number': return <Hash size={14} />
      case 'date': return <Calendar size={14} />
      case 'boolean': return <ToggleLeft size={14} />
      default: return <Type size={14} />
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>
          Showing {paginatedData.length} of {data.length} rows
        </span>

        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Page {currentPage} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '4px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#fff',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '4px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#fff',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: 'auto', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>

          <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#f8fafc' }}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.name}
                  onClick={() => handleSort(col.name)}
                  style={{
                    padding: '0.75rem 1rem',
                    textAlign: col.type === 'number' ? 'right' : 'left',
                    borderBottom: '2px solid #e2e8f0',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: col.type === 'number' ? 'flex-end' : 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: '#94a3b8' }}>{getTypeIcon(col.type)}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>{col.name}</span>
                    <span style={{ color: sortConfig.key === col.name ? '#3b82f6' : '#cbd5e1' }}>
                      {sortConfig.key === col.name ? (
                        sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      ) : (
                        <ChevronsUpDown size={16} />
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No data available
                </td>
              </tr>
            )}

            {paginatedData.map((row, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfdfe' }}>
                {columns.map((col) => {
                  const value = getValue(row, col.name)

                  return (
                    <td
                      key={col.name}
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: col.type === 'number' ? 'right' : 'left',
                        fontSize: '0.875rem',
                        color: '#475569',
                        borderBottom: '1px solid #f1f5f9'
                      }}
                    >
                      {col.type === 'boolean'
                        ? (value ? 'Yes' : 'No')
                        : String(value ?? '')}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}