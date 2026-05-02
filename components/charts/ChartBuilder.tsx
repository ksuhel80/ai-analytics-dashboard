"use client"

import React, { useState, useEffect } from 'react'
import { ColumnInfo, Chart } from '@/types'
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  AreaChart, 
  ScatterChart, 
  X,
  Plus
} from 'lucide-react'
import ChartRenderer from './ChartRenderer'

interface ChartBuilderProps {
  columns: ColumnInfo[]
  dashboardId: string
  dataset: any[]
  onSave: (chart: Partial<Chart>) => void
  onClose: () => void
  initialData?: Chart
}

const CHART_TYPES = [
  { id: 'bar', label: 'Bar', icon: BarChart },
  { id: 'line', label: 'Line', icon: LineChart },
  { id: 'pie', label: 'Pie', icon: PieChart },
  { id: 'area', label: 'Area', icon: AreaChart },
  { id: 'scatter', label: 'Scatter', icon: ScatterChart },
]

const AGGREGATIONS = ['sum', 'count', 'average', 'min', 'max']

export default function ChartBuilder({
  columns,
  dashboardId,
  dataset,
  onSave,
  onClose,
  initialData,
}: ChartBuilderProps) {
  const [config, setConfig] = useState<Partial<Chart>>(
    initialData || {
      dashboard_id: dashboardId,
      chart_type: 'bar',
      title: 'New Chart',
      aggregation: 'sum',
      x_axis: columns[0]?.name || '',
      y_axis: columns.find(c => c.type === 'number')?.name || columns[0]?.name || '',
    }
  )

  if (!dataset?.length) {
    console.warn("No dataset available for preview")
    }

  const [previewData, setPreviewData] = useState<any[]>([])

  // Mock data for preview if real data isn't available
  useEffect(() => {
    if (!dataset || !config.x_axis || !config.y_axis) return

    const mapped = dataset.map((row: any) => ({
      [config.x_axis!]: row[config.x_axis!],
      [config.y_axis!]: Number(row[config.y_axis!])
    }))
    
    setPreviewData(mapped)
  }, [dataset, config.x_axis, config.y_axis])

  const handleSave = async () => {
    try {
      const response = await fetch('/api/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (response.ok) {
        const savedChart = await response.json()
        onSave(savedChart)
      }
    } catch (error) {
      console.error('Failed to save chart:', error)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '1000px',
        height: '80%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Create New Chart</h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b',
          }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Form */}
          <div style={{
            width: '400px',
            padding: '1.5rem',
            borderRight: '1px solid #f1f5f9',
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Chart Type */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                  Chart Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {CHART_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setConfig({ ...config, chart_type: type.id as any })}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: config.chart_type === type.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                        backgroundColor: config.chart_type === type.id ? '#eff6ff' : '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem',
                        transition: 'all 0.2s',
                      }}
                    >
                      <type.icon size={20} color={config.chart_type === type.id ? '#3b82f6' : '#64748b'} />
                      <span style={{ fontSize: '0.75rem', color: config.chart_type === type.id ? '#1d4ed8' : '#64748b' }}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                  Chart Title
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              {/* X Axis */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                  X Axis Column
                </label>
                <select
                  value={config.x_axis || ''}
                  onChange={(e) => setConfig({ ...config, x_axis: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    backgroundColor: '#fff',
                  }}
                >
                  {columns.map(col => (
                    <option key={col.name} value={col.name}>{col.name}</option>
                  ))}
                </select>
              </div>

              {/* Y Axis */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                  Y Axis Column (Numeric)
                </label>
                <select
                  value={config.y_axis || ''}
                  onChange={(e) => setConfig({ ...config, y_axis: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    backgroundColor: '#fff',
                  }}
                >
                  {columns.filter(c => c.type === 'number').map(col => (
                    <option key={col.name} value={col.name}>{col.name}</option>
                  ))}
                </select>
              </div>

              {/* Aggregation */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                  Aggregation
                </label>
                <select
                  value={config.aggregation}
                  onChange={(e) => setConfig({ ...config, aggregation: e.target.value as any })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    backgroundColor: '#fff',
                  }}
                >
                  {AGGREGATIONS.map(agg => (
                    <option key={agg} value={agg}>{agg.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              {/* Group By */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                  Group By (Optional)
                </label>
                <select
                  value={config.group_by || ''}
                  onChange={(e) => setConfig({ ...config, group_by: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    backgroundColor: '#fff',
                  }}
                >
                  <option value="">None</option>
                  {columns.filter(c => c.type === 'string' || c.type === 'boolean').map(col => (
                    <option key={col.name} value={col.name}>{col.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{ flex: 1, padding: '2rem', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#475569' }}>Live Preview</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Preview uses sample data to show configuration.</p>
            </div>
            
            <div style={{ height: '400px' }}>
              <ChartRenderer 
                chart={config as Chart} 
                data={previewData} 
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#3b82f6',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Plus size={18} />
            Save Chart
          </button>
        </div>
      </div>
    </div>
  )
}
