"use client"

import React, { useId } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface BarChartProps {
  data: any[]
  xAxis: string
  yAxis: string
  title: string
  color?: string
}

export default function BarChartComponent({
  data,
  xAxis,
  yAxis,
  title,
  color = '#3b82f6',
}: BarChartProps) {
  const gradientId = useId()
  const [isExportMode, setIsExportMode] = React.useState(false)

  React.useEffect(() => {
    const checkExportMode = () => {
      setIsExportMode(document.body.classList.contains('export-mode'))
    }
    
    // Check initially
    checkExportMode()

    // Monitor for changes
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
        <BarChart
          data={data}
          width={isExportMode ? 1000 : undefined}
          height={isExportMode ? 350 : undefined}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0.3} />
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
            cursor={{ fill: '#f1f5f9' }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
          <Bar
            dataKey={yAxis}
            fill={isExportMode ? color : `url(#${gradientId})`}
            radius={[4, 4, 0, 0]}
            isAnimationActive={!isExportMode}
            animationDuration={isExportMode ? 0 : 1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
