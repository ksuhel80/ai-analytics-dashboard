"use client"

import React, { useMemo, useState } from 'react'
import { Chart } from '@/types'
import { aggregateData } from '@/lib/csv/parser'
import BarChartComponent from './BarChartComponent'
import LineChartComponent from './LineChartComponent'
import PieChartComponent from './PieChartComponent'
import AreaChartComponent from './AreaChartComponent'
import ScatterChartComponent from './ScatterChartComponent'
import { Pencil, Trash2 } from 'lucide-react'
import { ChartErrorBoundary } from './ChartErrorBoundary'

interface ChartRendererProps {
  chart: Chart
  data: Record<string, any>[]
  onEdit?: (chart: Chart) => void
  onDelete?: (chartId: string) => void
}

export default function ChartRenderer({
  chart,
  data,
  onEdit,
  onDelete,
}: ChartRendererProps) {
  const [isHovered, setIsHovered] = useState(false)
 
  const processedData = useMemo(() => {
    if (!chart.x_axis || !chart.y_axis) return []
    return aggregateData(
      data,
      chart.x_axis,
      chart.y_axis,
      chart.aggregation,
      chart.group_by || undefined
    )
  }, [data,
  chart.chart_type,
  chart.x_axis,
  chart.y_axis,
  chart.aggregation,
  chart.group_by])

  const renderChart = () => {
    const props = {
      data: processedData,
      xAxis: chart.x_axis!,
      yAxis: chart.y_axis!,
      title: chart.title,
    }
    console.log("data",data)
    switch (chart.chart_type) {
      case 'bar':
        return <BarChartComponent {...props} />
      case 'line':
        return <LineChartComponent {...props} />
      case 'pie':
        return (
          <PieChartComponent
            data={processedData}
            nameKey={chart.x_axis!}
            valueKey={chart.y_axis!}
            title={chart.title}
          />
        )
      case 'area':
        return <AreaChartComponent {...props} />
      case 'scatter':
        return <ScatterChartComponent {...props} />
      default:
        return (
          <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            Unsupported chart type: {chart.chart_type}
          </div>
        )
    }
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        border: '1px solid #f1f5f9',
        height: '100%',
        minHeight: '400px',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <span
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 500,
              backgroundColor: '#f1f5f9',
              color: '#475569',
              textTransform: 'capitalize',
              marginBottom: '4px',
            }}
          >
            {chart.chart_type}
          </span>
        </div>

        {isHovered && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {onEdit && (
              <button
                onClick={() => onEdit(chart)}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Pencil size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(chart.id)}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  backgroundColor: '#fff1f2',
                  border: '1px solid #fecdd3',
                  cursor: 'pointer',
                  color: '#e11d48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ height: 'calc(100% - 40px)' }}>
        <ChartErrorBoundary>
          {renderChart()}
        </ChartErrorBoundary>
      </div>
    </div>
  )
}
