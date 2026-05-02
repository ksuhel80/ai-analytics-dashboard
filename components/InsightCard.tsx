import React from 'react'
import { Insight } from '@/types'
import { Sparkles, AlertTriangle, TrendingUp, Lightbulb, MessageSquare } from 'lucide-react'

interface InsightCardProps {
  insight: Insight
}

const TYPE_CONFIG = {
  summary: {
    icon: Sparkles,
    bg: '#eff6ff',
    border: '#dbeafe',
    text: '#1e40af',
    accent: '#3b82f6'
  },
  anomaly: {
    icon: AlertTriangle,
    bg: '#fef2f2',
    border: '#fee2e2',
    text: '#991b1b',
    accent: '#ef4444'
  },
  trend: {
    icon: TrendingUp,
    bg: '#f0fdf4',
    border: '#dcfce7',
    text: '#166534',
    accent: '#22c55e'
  },
  recommendation: {
    icon: Lightbulb,
    bg: '#faf5ff',
    border: '#f3e8ff',
    text: '#6b21a8',
    accent: '#a855f7'
  },
  answer: {
    icon: MessageSquare,
    bg: '#fff7ed',
    border: '#ffedd5',
    text: '#9a3412',
    accent: '#f97316'
  }
}

export default function InsightCard({ insight }: InsightCardProps) {
  const config = TYPE_CONFIG[insight.type] || TYPE_CONFIG.summary
  const Icon = config.icon

  return (
    <div style={{
      backgroundColor: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: '12px',
      padding: '1.25rem',
      display: 'flex',
      gap: '1rem',
      transition: 'transform 0.2s',
      cursor: 'default'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '0.75rem',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        height: 'fit-content'
      }}>
        <Icon size={20} color={config.accent} />
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{
            fontSize: '0.625rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: config.text,
            backgroundColor: '#fff',
            padding: '2px 8px',
            borderRadius: '9999px',
            border: `1px solid ${config.border}`
          }}>
            {insight.type}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {new Date(insight.created_at).toLocaleDateString()}
          </span>
        </div>
        
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
          {insight.title}
        </h4>
        
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#475569' }}>
          {insight.content}
        </p>

        {insight.question && (
          <div style={{ 
            marginTop: '1rem', 
            paddingTop: '0.75rem', 
            borderTop: `1px solid ${config.border}`,
            fontSize: '0.75rem',
            fontStyle: 'italic',
            color: '#64748b'
          }}>
            Q: {insight.question}
          </div>
        )}
      </div>
    </div>
  )
}
