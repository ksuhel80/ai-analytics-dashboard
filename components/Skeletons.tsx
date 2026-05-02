import React from 'react'

export function Skeleton({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      className="animate-pulse"
      style={{
        backgroundColor: '#e2e8f0',
        borderRadius: '8px',
        ...style,
      }}
    />
  )
}

export function DashboardCardSkeleton() {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid #f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Skeleton style={{ width: '40px', height: '40px' }} />
        <div style={{ flex: 1 }}>
          <Skeleton style={{ width: '60%', height: '1.25rem', marginBottom: '4px' }} />
          <Skeleton style={{ width: '40%', height: '0.75rem' }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        <Skeleton style={{ height: '2.5rem' }} />
        <Skeleton style={{ height: '2.5rem' }} />
        <Skeleton style={{ height: '2.5rem' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
        <Skeleton style={{ width: '80px', height: '1rem' }} />
        <Skeleton style={{ width: '100px', height: '1rem' }} />
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '1.5rem',
      border: '1px solid #f1f5f9',
      height: '400px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton style={{ width: '80px', height: '1.5rem' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <Skeleton style={{ width: '24px', height: '24px' }} />
          <Skeleton style={{ width: '24px', height: '24px' }} />
        </div>
      </div>
      <Skeleton style={{ width: '40%', height: '1.5rem', margin: '0 auto' }} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '0 1rem' }}>
        <Skeleton style={{ flex: 1, height: '40%' }} />
        <Skeleton style={{ flex: 1, height: '70%' }} />
        <Skeleton style={{ flex: 1, height: '55%' }} />
        <Skeleton style={{ flex: 1, height: '90%' }} />
        <Skeleton style={{ flex: 1, height: '30%' }} />
      </div>
    </div>
  )
}

export function InsightSkeleton() {
  return (
    <div style={{
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      padding: '1.25rem',
      display: 'flex',
      gap: '1rem',
      border: '1px solid #e2e8f0',
    }}>
      <Skeleton style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <Skeleton style={{ width: '60px', height: '1.25rem' }} />
          <Skeleton style={{ width: '80px', height: '0.75rem' }} />
        </div>
        <Skeleton style={{ width: '40%', height: '1.25rem', marginBottom: '0.5rem' }} />
        <Skeleton style={{ width: '100%', height: '3rem' }} />
      </div>
    </div>
  )
}
