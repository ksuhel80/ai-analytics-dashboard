import React from 'react'
import Link from 'next/link'
import { 
  BarChart3, 
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  Download, 
  ArrowRight,
  Upload,
  Brain,
  BarChart2
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: '#fff', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#3b82f6', padding: '0.5rem', borderRadius: '10px' }}>
            <BarChart3 size={24} color="#fff" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em' }}>DataAI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/login" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', textDecoration: 'none' }}>Login</Link>
          <Link href="/signup" style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#0f172a',
            color: '#fff',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.3)'
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '6rem 2rem 4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#eff6ff',
          color: '#3b82f6',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '2rem'
        }}>
          <Sparkles size={16} />
          Powered by Llama 3.3
        </div>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-0.04em',
          marginBottom: '1.5rem',
          color: '#0f172a'
        }}>
          Turn Your CSV Data Into <br />
          <span style={{ color: '#3b82f6' }}>AI Insights</span> Instantly
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#64748b',
          maxWidth: '700px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.6
        }}>
          Upload any CSV. Get professional charts, deep-dive trends, and 
          conversational AI analysis in seconds. No complex formulas required.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/signup" style={{
            padding: '1rem 2.5rem',
            backgroundColor: '#3b82f6',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '1.125rem',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)'
          }}>
            Get Started Free
            <ArrowRight size={20} />
          </Link>
          <Link href="/login" style={{
            padding: '1rem 2.5rem',
            backgroundColor: '#fff',
            color: '#0f172a',
            borderRadius: '12px',
            fontSize: '1.125rem',
            fontWeight: 700,
            textDecoration: 'none',
            border: '2px solid #e2e8f0'
          }}>
            View Demo
          </Link>
        </div>
      </section>

      {/* Mock Dashboard Preview */}
      <section style={{ padding: '0 2rem 6rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '24px',
          border: '8px solid #f1f5f9',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          aspectRatio: '16/10'
        }}>
          <div style={{ height: '60px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }}></div>
            <div style={{ marginLeft: '1rem', height: '24px', width: '200px', backgroundColor: '#f1f5f9', borderRadius: '6px' }}></div>
          </div>
          <div style={{ flex: 1, display: 'flex' }}>
            <div style={{ width: '200px', borderRight: '1px solid #f1f5f9', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ height: '32px', backgroundColor: '#eff6ff', borderRadius: '6px' }}></div>
              <div style={{ height: '24px', backgroundColor: '#f8fafc', borderRadius: '6px' }}></div>
              <div style={{ height: '24px', backgroundColor: '#f8fafc', borderRadius: '6px' }}></div>
              <div style={{ height: '24px', backgroundColor: '#f8fafc', borderRadius: '6px' }}></div>
            </div>
            <div style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ gridColumn: 'span 2', height: '40px', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '1rem' }}></div>
              <div style={{ height: '200px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'flex-end', padding: '1.5rem', gap: '1rem' }}>
                <div style={{ flex: 1, height: '40%', backgroundColor: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ flex: 1, height: '70%', backgroundColor: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ flex: 1, height: '55%', backgroundColor: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ flex: 1, height: '90%', backgroundColor: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
              </div>
              <div style={{ height: '200px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '1.5rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '15px solid #3b82f6', margin: '0 auto', borderRightColor: '#eff6ff' }}></div>
              </div>
              <div style={{ gridColumn: 'span 2', height: '120px', backgroundColor: '#eff6ff', borderRadius: '16px', border: '1px solid #dbeafe', padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: '#fff', borderRadius: '8px' }}><Sparkles size={16} color="#3b82f6" /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: '12px', width: '150px', backgroundColor: '#3b82f6', borderRadius: '4px', marginBottom: '8px', opacity: 0.5 }}></div>
                    <div style={{ height: '8px', width: '100%', backgroundColor: '#3b82f6', borderRadius: '4px', opacity: 0.2 }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '6rem 2rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Everything you need to analyze data</h2>
            <p style={{ color: '#64748b', fontSize: '1.125rem' }}>Powerful tools that work together seamlessly.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { icon: BarChart2, title: 'Auto Charts', desc: 'Instantly generate bar, line, and pie charts from your data columns.' },
              { icon: Brain, title: 'AI Insights', desc: 'Our LLM detects patterns and anomalies you might have missed.' },
              { icon: MessageSquare, title: 'Ask Your Data', desc: 'Natural language chat to query your datasets like a human analyst.' },
              { icon: TrendingUp, title: 'Trend Detection', desc: 'Identify time-based trends and growth patterns automatically.' },
              { icon: AlertTriangle, title: 'Anomaly Alerts', desc: 'Statistical outlier detection to spot data quality issues early.' },
              { icon: Download, title: 'Export Reports', desc: 'Download professional PDF reports and Markdown summaries.' }
            ].map((f, i) => (
              <div key={i} style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '20px', border: '1px solid #f1f5f9', transition: 'all 0.2s' }}>
                <div style={{ backgroundColor: '#eff6ff', color: '#3b82f6', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <f.icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{f.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '8rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '4rem' }}>Three steps to clarity</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem' }}>
          {[
            { step: '01', title: 'Upload CSV', desc: 'Drag and drop any spreadsheet file into the dashboard.' },
            { step: '02', title: 'AI Analysis', desc: 'Our AI engine processes the data and generates a full report.' },
            { step: '03', title: 'Chat & Export', desc: 'Ask specific questions and export your findings as a report.' }
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ fontSize: '5rem', fontWeight: 900, color: '#f1f5f9', position: 'absolute', top: '-2rem', left: '50%', transform: 'translateX(-50%)', zIndex: -1 }}>
                {s.step}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>{s.title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          backgroundColor: '#0f172a',
          borderRadius: '32px',
          padding: '4rem 2rem',
          textAlign: 'center',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', backgroundColor: '#3b82f6', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2 }}></div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Ready to understand your data?</h2>
          <p style={{ fontSize: '1.125rem', color: '#94a3b8', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Join 5,000+ data analysts who are using DataAI to speed up their workflow.
          </p>
          <Link href="/signup" style={{
            display: 'inline-flex',
            padding: '1rem 2.5rem',
            backgroundColor: '#fff',
            color: '#0f172a',
            borderRadius: '12px',
            fontSize: '1.125rem',
            fontWeight: 700,
            textDecoration: 'none',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            Start Your Free Trial
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ backgroundColor: '#3b82f6', padding: '0.4rem', borderRadius: '8px' }}>
              <BarChart3 size={20} color="#fff" />
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: 800 }}>DataAI</span>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', fontSize: '0.875rem', color: '#64748b' }}>
            <span>© 2026 DataAI Inc.</span>
            <Link href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</Link>
            <Link href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</Link>
            <Link href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
