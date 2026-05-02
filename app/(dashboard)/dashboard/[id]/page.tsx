"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Dashboard, 
  Dataset, 
  Chart, 
  Insight, 
  ChartSuggestion, 
  ColumnInfo 
} from '@/types'
import ChartRenderer from '@/components/charts/ChartRenderer'
import ChartBuilder from '@/components/charts/ChartBuilder'
import DataTable from '@/components/DataTable'
import ColumnSummary from '@/components/ColumnSummary'
import InsightsSummary from '@/components/InsightsSummary'
import DataChatPanel from '@/components/DataChatPanel'
import ExportButton from '@/components/ExportButton'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { ChartSkeleton, InsightSkeleton } from '@/components/Skeletons'
import { 
  ArrowLeft, 
  BarChart2, 
  Table, 
  Sparkles, 
  MessageSquare, 
  Plus, 
  ChevronRight,
  Database,
  RefreshCw,
  Edit2,
  Check
} from 'lucide-react'

export default function DashboardDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [activeTab, setActiveTab] = useState<'charts' | 'data' | 'insights' | 'chat'>('charts')
  const [showChartBuilder, setShowChartBuilder] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')

  useKeyboardShortcuts({
    onNew: () => router.push('/dashboard'),
    onSwitchTab: (index) => {
      const tabs: ('charts' | 'data' | 'insights' | 'chat')[] = ['charts', 'data', 'insights', 'chat']
      if (tabs[index]) setActiveTab(tabs[index])
    }
  })

  useEffect(() => {
    if (id) fetchDashboard()
  }, [id])

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/dashboards/${id}`)
      if (response.ok) {
        const data = await response.json()
        
        setDashboard(data)
        setEditedTitle(data.name)
        
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }
  console.log("Dashboard:", dashboard)
  const handleUpdateTitle = async () => {
    if (!dashboard || editedTitle === dashboard.name) {
      setIsEditingTitle(false)
      return
    }
    
    try {
      const response = await fetch(`/api/dashboards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editedTitle })
      })
      if (response.ok) {
        setDashboard({ ...dashboard, name: editedTitle })
        setIsEditingTitle(false)
      }
    } catch (error) {
      console.error('Failed to update title:', error)
    }
  }

  const handleAddChart = async (chartConfig: Partial<Chart>) => {
    try {
      const response = await fetch('/api/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...chartConfig, dashboard_id: id })
      })
      if (response.ok) {
        fetchDashboard()
        setShowChartBuilder(false)
      }
    } catch (error) {
      console.error('Failed to add chart:', error)
    }
  }

  const handleReanalyze = async () => {
    setIsAnalyzing(true)
    try {
      await fetch(`/api/dashboards/${id}/analyze`, { method: 'POST' })
      fetchDashboard()
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!dashboard && !loading) return <div>Dashboard not found</div>

  console.log("Dashboard:", dashboard)
console.log("Dataset:", dashboard?.dataset)
console.log("Preview data:", dashboard?.dataset?.preview_data)

  return (
    <div id="dashboard-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f8fafc' }}>
      {/* Top Bar */}
      <div style={{ 
        padding: '1rem 2rem', 
        backgroundColor: '#fff', 
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button 
            onClick={() => router.push('/dashboard')}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: '#64748b',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ArrowLeft size={20} />
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className="animate-pulse" style={{ width: '150px', height: '1.25rem', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                <div className="animate-pulse" style={{ width: '250px', height: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '4px' }} />
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isEditingTitle ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        autoFocus
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle()}
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: '#1e293b',
                          border: '1px solid #3b82f6',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          outline: 'none'
                        }}
                      />
                      <button onClick={handleUpdateTitle} style={{ color: '#10b981', border: 'none', background: 'none', cursor: 'pointer' }}>
                        <Check size={20} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>{dashboard?.name}</h1>
                      <button onClick={() => setIsEditingTitle(true)} style={{ color: '#cbd5e1', border: 'none', background: 'none', cursor: 'pointer' }}>
                        <Edit2 size={14} />
                      </button>
                    </>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                  <Database size={12} />
                  {dashboard?.dataset?.name} • {dashboard?.dataset?.row_count} rows • {dashboard?.dataset?.column_count} columns
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {dashboard && <ExportButton dashboardId={dashboard.id} dashboardName={dashboard.name} />}
          <button
            onClick={() => setShowChartBuilder(true)}
            disabled={loading}
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
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
              opacity: loading ? 0.7 : 1
            }}
          >
            <Plus size={18} />
            Add Chart
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{ padding: '0 2rem', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { id: 'charts', label: 'Charts', icon: BarChart2 },
            { id: 'data', label: 'Data', icon: Table },
            { id: 'insights', icon: Sparkles, label: 'Insights' },
            { id: 'chat', label: 'Ask AI', icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 0',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: activeTab === tab.id ? '#3b82f6' : '#64748b',
                border: 'none',
                background: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? '#3b82f6' : 'transparent'}`,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.5 : 1
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div key={activeTab} className="fade-in" style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        {loading ? (
          /* Global loading state */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3, 4].map(i => <ChartSkeleton key={i} />)}
          </div>
        ) : (
          <>
            {activeTab === 'charts' && (
              <div>
                {dashboard?.charts && dashboard.charts.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '2rem' }}>
                    {dashboard.charts.map(chart => (
                      <ChartRenderer 
                        key={chart.id} 
                        chart={chart} 
                        data={dashboard.dataset?.preview_data || []} 
                        onDelete={async (cid) => {
                          if (confirm('Delete this chart?')) {
                            await fetch(`/api/charts/${cid}`, { method: 'DELETE' })
                            fetchDashboard()
                          }
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{ 
                    padding: '5rem', 
                    textAlign: 'center', 
                    backgroundColor: '#fff', 
                    borderRadius: '24px', 
                    border: '2px dashed #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem'
                  }}>
                    <div style={{ padding: '1.5rem', backgroundColor: '#f1f5f9', borderRadius: '9999px', color: '#94a3b8' }}>
                      <BarChart2 size={48} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>No charts yet</h3>
                      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Start visualizing your data by adding your first chart.</p>
                    </div>
                    <button
                      onClick={() => setShowChartBuilder(true)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#0f172a',
                        color: '#fff',
                        borderRadius: '10px',
                        border: 'none',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Plus size={18} />
                      Add First Chart
                    </button>
                  </div>
                )}
              </div>
            )}
             
            {activeTab === 'data' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  overflowX: 'auto', 
                  paddingBottom: '1rem',
                  scrollbarWidth: 'thin'
                }}>
                  {dashboard?.dataset?.columns.map(col => (
                    <div key={col.name} style={{ minWidth: '280px' }}>
                      <ColumnSummary column={col} />
                    </div>
                  ))}
                </div>
               
                <div style={{ height: '600px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <DataTable 
                      data={dashboard?.dataset?.preview_data || []} 
                      columns={dashboard?.dataset?.columns || []} 
                  />
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                  <button
                    onClick={handleReanalyze}
                    disabled={isAnalyzing}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem 1.25rem',
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: isAnalyzing ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <RefreshCw size={16} className={isAnalyzing ? 'animate-spin' : ''} />
                    {isAnalyzing ? 'Analyzing...' : 'Re-analyze Dataset'}
                  </button>
                </div>
                {isAnalyzing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {[1, 2, 3, 4, 5].map(i => <InsightSkeleton key={i} />)}
                  </div>
                ) : (
                  dashboard && (
                    <InsightsSummary 
                      insights={dashboard.insights || []} 
                      isLoading={isAnalyzing} 
                      onGenerateMore={handleReanalyze} 
                    />
                  )
                )}
              </div>
            )}

            {activeTab === 'chat' && dashboard && (
              <div style={{ height: 'calc(100vh - 250px)', maxWidth: '900px', margin: '0 auto' }}>
                <DataChatPanel 
                  dashboardId={dashboard.id} 
                  columns={dashboard.dataset?.columns || []} 
                  onChartSuggestion={(suggestion) => {
                    handleAddChart({
                      chart_type: suggestion.chart_type as any,
                      x_axis: suggestion.x_axis,
                      y_axis: suggestion.y_axis,
                      title: suggestion.title,
                      aggregation: 'sum'
                    })
                    setActiveTab('charts')
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
        
      {/* Chart Builder Modal */}
      {showChartBuilder && dashboard && (
        <ChartBuilder
          columns={dashboard.dataset?.columns || []}
          dashboardId={dashboard.id}
          dataset={dashboard?.dataset?.preview_data || []}
          onSave={() => {
            fetchDashboard()
            setShowChartBuilder(false)
            setActiveTab('charts')
          }}
          onClose={() => setShowChartBuilder(false)}
        />
      )}
    </div>
  )
}
