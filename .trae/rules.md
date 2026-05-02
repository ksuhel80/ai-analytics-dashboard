# AI Analytics Dashboard Rules

## Stack
- Next.js 14 App Router TypeScript
- Tailwind CSS + inline styles
- @supabase/auth-helpers-nextjs (NOT @supabase/ssr)
- Groq AI (llama-3.3-70b-versatile model)
- Recharts for all charts
- Papaparse for CSV parsing (use require())
- Sonner for toasts
- Lucide React for icons
- date-fns for dates
- jspdf + html2canvas for PDF export

## Critical Rules
- createClientComponentClient → client components
- createServerComponentClient → server components
- createRouteHandlerClient → API routes
- always use proxy instead of middleware
- Always try/catch with descriptive errors
- Always add loading states
- Mobile responsive always
- Use inline styles when Tailwind conflicts
- Never use @supabase/ssr
- Use require() for CommonJS packages
- Recharts components must be in client components only
- All chart components need "use client" directive