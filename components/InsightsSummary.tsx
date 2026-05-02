"use client"

import React, { useState } from 'react'
import { Insight } from '@/types'
import InsightCard from './InsightCard'
import { ChevronDown, ChevronRight, Sparkles, RefreshCw } from 'lucide-react'

interface InsightsSummaryProps {
  insights: Insight[]
  onGenerateMore?: () => void
  isLoading?: boolean
}

export default function InsightsSummary({ insights, onGenerateMore, isLoading }: InsightsSummaryProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(['summary', 'anomaly', 'trend', 'recommendation', 'answer']))

  const toggleType = (type: string) => {
    const newSet = new Set(expandedTypes)
    if (newSet.has(type)) newSet.delete(type)
    else newSet.add(type)
    setExpandedTypes(newSet)
  }

  const insightsByType = insights.reduce((acc, insight) => {
    if (!acc[insight.type]) acc[insight.type] = []
    acc[insight.type].push(insight)
    return acc
  }, {} as Record<string, Insight[]>)

  const types = Object.keys(insightsByType)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Sparkles color="#3b82f6" />
          AI Data Insights
        </h2>
        {onGenerateMore && (
          <button
            onClick={onGenerateMore}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Generating...' : 'Generate More'}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {types.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
            <p style={{ color: '#64748b' }}>No insights generated yet. Click "Generate More" to start analyzing.</p>
          </div>
        ) : (
          types.map((type) => (
            <div key={type} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                onClick={() => toggleType(type)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  width: 'fit-content'
                }}
              >
                {expandedTypes.has(type) ? <ChevronDown size={20} color="#64748b" /> : <ChevronRight size={20} color="#64748b" />}
                <h3 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em', 
                  color: '#64748b' 
                }}>
                  {type}s ({insightsByType[type].length})
                </h3>
              </button>

              {expandedTypes.has(type) && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                  gap: '1.25rem' 
                }}>
                  {insightsByType[type].map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
