"use client"

import React, { useState } from 'react'
import { Download, FileText, FileJson, Loader2, ChevronDown } from 'lucide-react'
import html2canvas from 'html2canvas'
const { jsPDF } = require('jspdf')

interface ExportButtonProps {
  dashboardId: string
  dashboardName: string
}

export default function ExportButton({ dashboardId, dashboardName }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const exportAsPDF = async () => {
  setIsExporting(true)
  setIsOpen(false)
    try {
      const original = document.getElementById('dashboard-content')
      if (!original) return

      // ✅ Enable export mode
      document.body.classList.add("export-mode")

      // ✅ Force a re-render
      window.dispatchEvent(new Event('resize'))

      // ✅ Longer wait for Recharts to fully paint
      await new Promise(resolve => setTimeout(resolve, 3000))

      const canvas = await html2canvas(original, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 1200, // Match the cloned width
        onclone: (clonedDoc) => {
          const clonedEl = clonedDoc.getElementById('dashboard-content')
          if (clonedEl) {
            // ✅ Force the cloned element to be fully expanded and visible
            clonedEl.style.height = 'auto'
            clonedEl.style.width = '1200px'
            clonedEl.style.overflow = 'visible'
            clonedEl.style.position = 'relative'
            clonedEl.style.padding = '40px'
            clonedEl.style.backgroundColor = '#ffffff'
            
            // Remove scrollbars from the clone
            clonedDoc.body.style.overflow = 'visible'
            clonedDoc.documentElement.style.overflow = 'visible'
            
            // Fix sticky/fixed elements
            clonedEl.querySelectorAll('*').forEach((el: any) => {
              const style = window.getComputedStyle(el)
              if (style.position === 'sticky' || style.position === 'fixed') {
                el.style.position = 'relative'
                el.style.top = '0'
              }
            })

            // Ensure main content is visible
            const mainContent = clonedEl.querySelector('.fade-in') as HTMLElement
            if (mainContent) {
              mainContent.style.overflow = 'visible'
              mainContent.style.height = 'auto'
              mainContent.style.display = 'block'
            }
            
            // ✅ Fix SVG rendering issues
            clonedEl.querySelectorAll('svg').forEach((svg: any) => {
              svg.style.overflow = 'visible'
              svg.style.opacity = '1'
              svg.style.display = 'block'
              
              const bbox = svg.getBoundingClientRect()
              if (bbox.width > 0) svg.setAttribute('width', bbox.width)
              if (bbox.height > 0) svg.setAttribute('height', bbox.height)
            })

          // ✅ Fix faded colors in SVG (Recharts)
          clonedEl.querySelectorAll('svg *').forEach((el: any) => {
            // Force full opacity on everything
            el.style.opacity = '1'
            el.style.visibility = 'visible'
            
            if (el.getAttribute('fill-opacity')) el.setAttribute('fill-opacity', '1')
            if (el.getAttribute('stroke-opacity')) el.setAttribute('stroke-opacity', '1')
            if (el.style.fillOpacity) el.style.fillOpacity = '1'
            if (el.style.strokeOpacity) el.style.strokeOpacity = '1'
          })

          // ✅ Robust Gradient Replacement
          // Instead of looking for url(#id), we'll find anything that looks like a gradient fill
          clonedEl.querySelectorAll('*').forEach((el: any) => {
            const fill = el.getAttribute('fill') || el.style.fill
            const stroke = el.getAttribute('stroke') || el.style.stroke

            if (fill && fill.includes('url(')) {
              const idMatch = fill.match(/#([^'")\s]+)/)
              if (idMatch) {
                const gradId = idMatch[1]
                const grad = clonedDoc.getElementById(gradId)
                if (grad) {
                  const color = grad.querySelector('stop')?.getAttribute('stop-color') || '#3b82f6'
                  el.setAttribute('fill', color)
                  el.style.fill = color
                }
              }
            }

            if (stroke && stroke.includes('url(')) {
              const idMatch = stroke.match(/#([^'")\s]+)/)
              if (idMatch) {
                const gradId = idMatch[1]
                const grad = clonedDoc.getElementById(gradId)
                if (grad) {
                  const color = grad.querySelector('stop')?.getAttribute('stop-color') || '#3b82f6'
                  el.setAttribute('stroke', color)
                  el.style.stroke = color
                }
              }
            }
          })

          // ✅ Ensure all text is visible and dark for printing
          clonedEl.querySelectorAll('text, span, p, h1, h2, h3, h4').forEach((el: any) => {
            el.style.opacity = '1'
            el.style.color = '#1e293b'
            if (el.tagName.toLowerCase() === 'text') {
              el.style.fill = '#1e293b'
            }
          })
        }
      }
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Calculate dimensions to fit the page width
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add subsequent pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`${dashboardName.replace(/\s+/g, '_')}_report.pdf`)
  } catch (error) {
    console.error('PDF Export failed:', error)
  } finally {
    document.body.classList.remove("export-mode")
    setIsExporting(false)
  }
}

  const exportAsMarkdown = async () => {
    setIsExporting(true)
    setIsOpen(false)
    try {
      // In a real app, you'd fetch the dashboard data and generate MD
      const response = await fetch(`/api/dashboards/${dashboardId}/export`)
      const result = await response.json()

if (!result?.markdown) {
  console.error("Markdown missing:", result)
  alert("Markdown export failed. Check API.")
  return
}

const markdown = result.markdown
      
      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${dashboardName.replace(/\s+/g, '_')}_summary.md`
      a.click()
    } catch (error) {
      console.error('Markdown Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
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
          cursor: isExporting ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
      >
        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        {isExporting ? 'Exporting...' : 'Export'}
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <>
          <div 
            onClick={() => setIsOpen(false)} 
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 40 }} 
          />
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '200px',
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            padding: '0.5rem',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <button
              onClick={exportAsPDF}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                width: '100%',
                border: 'none',
                background: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <FileText size={16} color="#ef4444" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>PDF Report</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Visual dashboard export</span>
              </div>
            </button>

            <button
              onClick={exportAsMarkdown}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                width: '100%',
                border: 'none',
                background: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <FileJson size={16} color="#3b82f6" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>Markdown</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Executive summary text</span>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
