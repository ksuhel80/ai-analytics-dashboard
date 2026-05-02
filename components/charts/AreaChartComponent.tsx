"use client"

import React, { useId } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface AreaChartProps {
  data: any[]
  xAxis: string
  yAxis: string
  title: string
  color?: string
}

export default function AreaChartComponent({
  data,
  xAxis,
  yAxis,
  title,
  color = '#8b5cf6',
}: AreaChartProps) {
  const gradientId = useId()
  const [isExportMode, setIsExportMode] = React.useState(false)

  React.useEffect(() => {
    const checkExportMode = () => {
      setIsExportMode(document.body.classList.contains('export-mode'))
    }
    checkExportMode()
    const observer = new MutationObserver(checkExportMode)
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ width: '100%', height: 350, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>
        {title}
      </h3>
      <ResponsiveContainer width={isExportMode ? 1000 : "100%"} height={isExportMode ? 350 : "100%"}>
        <AreaChart
          data={data}
          width={isExportMode ? 1000 : undefined}
          height={isExportMode ? 350 : undefined}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey={xAxis}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Area
            type="monotone"
            dataKey={yAxis}
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={isExportMode ? color : `url(#${gradientId})`}
            isAnimationActive={!isExportMode}
            animationDuration={isExportMode ? 0 : 1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
