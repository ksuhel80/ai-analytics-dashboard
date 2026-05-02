"use client"

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface LineChartProps {
  data: any[]
  xAxis: string
  yAxis: string
  title: string
  color?: string
}

export default function LineChartComponent({
  data,
  xAxis,
  yAxis,
  title,
  color = '#10b981',
}: LineChartProps) {
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
        <LineChart
          data={data}
          width={isExportMode ? 1000 : undefined}
          height={isExportMode ? 350 : undefined}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
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
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
          <Line
            type="monotone"
            dataKey={yAxis}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            isAnimationActive={!isExportMode}
            animationDuration={isExportMode ? 0 : 1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
