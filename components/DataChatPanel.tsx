"use client"

import React, { useState, useEffect, useRef } from 'react'
import { ColumnInfo, DataChat, ChartSuggestion } from '@/types'
import { Send, Bot, User, Loader2, BarChart2, PlusCircle } from 'lucide-react'

interface DataChatPanelProps {
  dashboardId: string
  columns: ColumnInfo[]
  onChartSuggestion: (suggestion: ChartSuggestion) => void
}

const EXAMPLE_QUESTIONS = [
  "What is the total sales by category?",
  "Which month had the highest revenue?",
  "Are there any outliers in the data?",
  "What are the main trends in this dataset?"
]

export default function DataChatPanel({
  dashboardId,
  columns,
  onChartSuggestion
}: DataChatPanelProps) {
  const [messages, setMessages] = useState<DataChat[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/chat?dashboardId=${dashboardId}`)
        if (response.ok) {
          const history = await response.json()
          setMessages(history)
        }
      } catch (error) {
        console.error('Failed to fetch chat history:', error)
      }
    }
    fetchHistory()
  }, [dashboardId])

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return

    const userMessage: DataChat = {
      id: Date.now().toString(),
      dashboard_id: dashboardId,
      user_id: 'current-user', // Should come from auth
      role: 'user',
      content: text,
      chart_suggestion: null,
      created_at: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboardId,
          question: text,
          history: messages
        })
      })

      if (response.ok) {
        const aiResponse = await response.json()
        setMessages(prev => [...prev, aiResponse])
      }
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#fff',
      borderRadius: '16px',
      border: '1px solid #f1f5f9',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ backgroundColor: '#eff6ff', padding: '0.5rem', borderRadius: '8px' }}>
          <Bot size={20} color="#3b82f6" />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Data Assistant</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Ask anything about your data</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {messages.length === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
            <div style={{ opacity: 0.5 }}><Bot size={48} color="#94a3b8" /></div>
            <div>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Hello! I can help you analyze your data. Try asking:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {EXAMPLE_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      fontSize: '0.875rem',
                      color: '#475569',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} style={{
            display: 'flex',
            gap: '0.75rem',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start'
          }}>
            <div style={{
              backgroundColor: msg.role === 'user' ? '#3b82f6' : '#f1f5f9',
              padding: '0.5rem',
              borderRadius: '8px',
              color: msg.role === 'user' ? '#fff' : '#64748b'
            }}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '80%' }}>
              <div style={{
                backgroundColor: msg.role === 'user' ? '#3b82f6' : '#f8fafc',
                color: msg.role === 'user' ? '#fff' : '#1e293b',
                padding: '0.75rem 1rem',
                borderRadius: msg.role === 'user' ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                boxShadow: msg.role === 'user' ? 'none' : '0 1px 2px 0 rgb(0 0 0 / 0.05)'
              }}>
                {msg.content}
              </div>

              {msg.chart_suggestion && (
                <div style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginTop: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}>
                    <BarChart2 size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Chart Suggestion</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{msg.chart_suggestion.title}</div>
                  <button
                    onClick={() => onChartSuggestion(msg.chart_suggestion!)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: '#eff6ff',
                      color: '#3b82f6',
                      border: '1px solid #dbeafe',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <PlusCircle size={14} />
                    Add to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#f1f5f9', padding: '0.5rem', borderRadius: '8px', color: '#64748b' }}>
              <Bot size={18} />
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div className="animate-bounce" style={{ width: '8px', height: '8px', backgroundColor: '#cbd5e1', borderRadius: '50%' }}></div>
              <div className="animate-bounce" style={{ width: '8px', height: '8px', backgroundColor: '#cbd5e1', borderRadius: '50%', animationDelay: '0.2s' }}></div>
              <div className="animate-bounce" style={{ width: '8px', height: '8px', backgroundColor: '#cbd5e1', borderRadius: '50%', animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          style={{ position: 'relative' }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your data..."
            style={{
              width: '100%',
              padding: '0.875rem 3.5rem 0.875rem 1rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: input.trim() ? '#3b82f6' : '#f1f5f9',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  )
}
