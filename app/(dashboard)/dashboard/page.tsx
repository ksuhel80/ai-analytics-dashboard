"use client"

import React, { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Dashboard, ParsedCSV } from '@/types'
import CSVUploader from '@/components/CSVUploader'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { DashboardCardSkeleton } from '@/components/Skeletons'
import { 
  Plus, 
  LayoutDashboard, 
  BarChart2, 
  Database, 
  Calendar, 
  Pin, 
  Trash2,
  ArrowRight,
  UploadCloud,
  X
} from 'lucide-react'

export default function DashboardPage() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploader, setShowUploader] = useState(false)
  const [newDatasetName, setNewDatasetName] = useState('')
  const [uploadedData, setUploadedData] = useState<{ parsed: ParsedCSV; file: File } | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  useKeyboardShortcuts({
    onNew: () => setShowUploader(true),
  })

  useEffect(() => {
    fetchDashboards()
  }, [])

 const fetchDashboards = async () => {
  try {
    const response = await fetch('/api/dashboards')

    if (!response.ok) {
      const err = await response.text()
      console.error("Fetch dashboards failed:", err)
      return
    }

    const data = await response.json()
    setDashboards(data)
  } catch (error) {
    console.error('Error fetching dashboards:', error)
  } finally {
    setLoading(false)
  }
}

const handleUploadComplete = (parsed: ParsedCSV, file: File) => {
  setUploadedData({ parsed, file })
  setNewDatasetName(file.name.replace('.csv', ''))
}

const handleCreateDashboard = async () => {
  if (!uploadedData || !newDatasetName) return
  setIsSaving(true)

  try {
    // =========================
    // 1. Save Dataset
    // =========================
    const parsed = uploadedData.parsed

    const preview = parsed.data.slice(0, 50)

    const datasetRes = await fetch('/api/datasets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newDatasetName,
        file_name: uploadedData.file.name,

        columns: parsed.columns,
        row_count: parsed.row_count,
        column_count: parsed.column_count,

        preview // ✅ REQUIRED
      }),
    })

    // 🔥 CHECK RESPONSE
    if (!datasetRes.ok) {
      const err = await datasetRes.text()
      console.error("Dataset API failed:", err)
      return
    }

    const dataset = await datasetRes.json()

    // 🔥 VALIDATE DATASET
    if (!dataset?.id) {
      console.error("Dataset ID missing:", dataset)
      return
    }

    // =========================
    // 2. Create Dashboard
    // =========================
    const dashboardRes = await fetch('/api/dashboards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${newDatasetName} Dashboard`,
        dataset_id: dataset.id
      }),
    })

    // 🔥 CHECK RESPONSE
    if (!dashboardRes.ok) {
      const err = await dashboardRes.text()
      console.error("Dashboard API failed:", err)
      return
    }

    const dashboard = await dashboardRes.json()

    // 🔥 VALIDATE DASHBOARD
    if (!dashboard?.id) {
      console.error("Dashboard ID missing:", dashboard)
      return
    }

    // =========================
    // 3. Navigate
    // =========================
    router.push(`/dashboard/${dashboard.id}`)

  } catch (error) {
    console.error('Failed to create dashboard:', error)
  } finally {
    setIsSaving(false)
  }
}

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this dashboard?')) {
      await fetch(`/api/dashboards/${id}`, { method: 'DELETE' })
      fetchDashboards()
    }
  }

  const handlePin = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await fetch(`/api/dashboards/${id}/pin`, { method: 'POST' })
    fetchDashboards()
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a' }}>Your Dashboards</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage and analyze your uploaded datasets</p>
        </div>
        <button
          onClick={() => setShowUploader(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: '#fff',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <Plus size={20} />
          New Dashboard
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3].map(i => <DashboardCardSkeleton key={i} />)}
        </div>
      ) : dashboards.length === 0 ? (
        /* Empty State */
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '24px',
          padding: '5rem 2rem',
          textAlign: 'center',
          border: '2px dashed #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '9999px', color: '#3b82f6' }}>
            <UploadCloud size={48} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Upload your first CSV</h2>
            <p style={{ color: '#64748b', marginTop: '0.5rem', maxWidth: '400px', margin: '0.5rem auto' }}>
              Turn your raw spreadsheet data into interactive AI-powered insights in seconds.
            </p>
          </div>
          <button
            onClick={() => setShowUploader(true)}
            style={{
              padding: '1rem 2.5rem',
              backgroundColor: '#0f172a',
              color: '#fff',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            Upload CSV
            <ArrowRight size={20} />
          </button>
        </div>
      ) : (
        /* Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {dashboards.map((d) => (
            <div
              key={d.id}
              onClick={() => router.push(`/dashboard/${d.id}`)}
              style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #f1f5f9',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: '#f1f5f9', borderRadius: '8px', color: '#64748b' }}>
                    <LayoutDashboard size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, color: '#1e293b' }}>{d.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>
                      <Database size={12} />
                      {d.dataset?.name}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={(e) => handlePin(d.id, e)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: d.is_pinned ? '#3b82f6' : '#cbd5e1' }}
                  >
                    <Pin size={16} fill={d.is_pinned ? '#3b82f6' : 'none'} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(d.id, e)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
                <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.625rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Rows</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>{d.dataset?.row_count || 0}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.625rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Cols</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>{d.dataset?.column_count || 0}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.625rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Charts</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>{d.charts?.length || 0}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <Calendar size={12} />
                  {new Date(d.created_at).toLocaleDateString()}
                </div>
                <div style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
                  Open Dashboard
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploader Modal */}
      {showUploader && (
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
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '24px',
            width: '90%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => { setShowUploader(false); setUploadedData(null); }}
              style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={24} />
            </button>

            <div style={{ padding: '3rem 2rem' }}>
              {!uploadedData ? (
                <CSVUploader onUpload={handleUploadComplete} />
              ) : (
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Almost ready!
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                        Dataset Name
                      </label>
                      <input
                        type="text"
                        value={newDatasetName}
                        onChange={(e) => setNewDatasetName(e.target.value)}
                        placeholder="e.g. Sales Q1 2024"
                        style={{
                          width: '100%',
                          padding: '0.875rem 1rem',
                          borderRadius: '10px',
                          border: '1px solid #e2e8f0',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    
                    <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Summary</div>
                      <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>File</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{uploadedData.file.name}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Rows</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{uploadedData.parsed.row_count}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Columns</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{uploadedData.parsed.column_count}</div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleCreateDashboard}
                      disabled={isSaving || !newDatasetName}
                      style={{
                        padding: '1rem',
                        backgroundColor: '#3b82f6',
                        color: '#fff',
                        borderRadius: '12px',
                        border: 'none',
                        fontWeight: 700,
                        cursor: (isSaving || !newDatasetName) ? 'not-allowed' : 'pointer',
                        opacity: (isSaving || !newDatasetName) ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        fontSize: '1rem'
                      }}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%' }}></div>
                          Creating Dashboard...
                        </>
                      ) : (
                        <>
                          Get Started
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
