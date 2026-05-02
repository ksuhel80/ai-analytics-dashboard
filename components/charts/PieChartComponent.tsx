"use client"

import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface PieChartProps {
  data: any[]
  nameKey: string
  valueKey: string
  title: string
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
]

export default function PieChartComponent({
  data,
  nameKey,
  valueKey,
  title,
}: PieChartProps) {
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
        <PieChart width={isExportMode ? 1000 : undefined} height={isExportMode ? 350 : undefined}>
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            isAnimationActive={!isExportMode}
            animationDuration={isExportMode ? 0 : 1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
