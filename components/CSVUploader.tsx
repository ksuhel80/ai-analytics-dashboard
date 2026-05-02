"use client"

import React, { useState, useCallback } from 'react'
import { ParsedCSV } from '@/types'
import { analyzeColumns } from '@/lib/csv/parser'
import { Upload, FileText, Check, AlertCircle } from 'lucide-react'
const Papa = require('papaparse')

interface CSVUploaderProps {
  onUpload: (parsed: ParsedCSV, file: File) => void
}

export default function CSVUploader({ onUpload }: CSVUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedCSV | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)

  const handleParse = (selectedFile: File) => {
    setFile(selectedFile)
    setError(null)
    setWarning(null)
    setProgress(0)

    if (selectedFile.size > 10 * 1024 * 1024) {
      setWarning("Large file detected (>10MB). Processing might be slow.")
    }

    Papa.parse(selectedFile, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const data = results.data
        const fields = results.meta.fields || []
        
        if (data.length > 50000) {
          setWarning("Very large dataset (>50k rows). Performance may be affected in the browser.")
        }

        try {
          const columns = analyzeColumns(data, fields)
          const parsed: ParsedCSV = {
            columns,
            data,
            row_count: data.length,
            column_count: fields.length
          }
          setParsedData(parsed)
          setProgress(100)
        } catch (err) {
          setError("Failed to analyze columns. Please ensure your CSV is valid.")
        }
      },
      error: (err: any) => {
        setError(`Error parsing CSV: ${err.message}`)
      }
    })
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'text/csv') {
      handleParse(droppedFile)
    } else {
      setError("Please upload a valid CSV file.")
    }
  }, [])

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      {!parsedData ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          style={{
            border: `2px dashed ${isDragging ? '#3b82f6' : '#e2e8f0'}`,
            borderRadius: '16px',
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: isDragging ? '#eff6ff' : '#f8fafc',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onClick={() => document.getElementById('csv-input')?.click()}
        >
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && handleParse(e.target.files[0])}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '9999px', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Upload size={32} color="#3b82f6" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>Upload your dataset</h3>
              <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Drag and drop your CSV file here, or click to browse</p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ color: '#10b981' }}><Check size={24} /></div>
              <div>
                <h3 style={{ fontWeight: 600 }}>{file?.name}</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{parsedData.row_count} rows • {parsedData.column_count} columns</p>
              </div>
            </div>
            <button
              onClick={() => { setFile(null); setParsedData(null); }}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Change file
            </button>
          </div>

          <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '1rem' }}>Data Preview</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr>
                  {parsedData.columns.map(col => (
                    <th key={col.name} style={{ textAlign: 'left', padding: '0.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: 600 }}>{col.name}</div>
                      <div style={{ fontWeight: 400, color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.625rem' }}>{col.type}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedData.data.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {parsedData.columns.map(col => (
                      <td key={col.name} style={{ padding: '0.5rem', borderBottom: '1px solid #f1f5f9', color: '#64748b' }}>
                        {String(row[col.name] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => onUpload(parsedData, file!)}
              style={{
                backgroundColor: '#3b82f6',
                color: '#fff',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)'
              }}
            >
              Confirm & Create Dashboard
            </button>
          </div>
        </div>
      )}

      {warning && (
        <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '8px', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span style={{ fontSize: '0.875rem' }}>{warning}</span>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span style={{ fontSize: '0.875rem' }}>{error}</span>
        </div>
      )}
    </div>
  )
}
