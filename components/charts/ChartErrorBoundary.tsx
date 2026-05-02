"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ChartErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Chart Error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          backgroundColor: '#fff1f2',
          borderRadius: '12px',
          border: '1px solid #fecdd3',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <AlertCircle size={32} color="#e11d48" />
          <div>
            <h4 style={{ fontWeight: 600, color: '#9f1239' }}>Chart failed to load</h4>
            <p style={{ fontSize: '0.875rem', color: '#be123c', marginTop: '4px' }}>
              There was an error rendering this visualization.
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#fff',
              border: '1px solid #fecdd3',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#e11d48',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
