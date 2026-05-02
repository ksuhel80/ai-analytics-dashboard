import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params   // ✅ FIXED

  const supabase = await createServerSupabase()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: dashboard, error } = await supabase
    .from('dashboards')
    .select(`
      *,
      dataset:datasets(*),
      charts(*),
      insights(*)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !dashboard) {
    return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 })
  }

  // ✅ Always build markdown
  let markdown = `# ${dashboard.name}\n\n`

  markdown += `## Dataset\n`
  markdown += `- Rows: ${dashboard.dataset?.row_count || 0}\n`
  markdown += `- Columns: ${dashboard.dataset?.column_count || 0}\n\n`

  markdown += `## Charts\n`
  dashboard.charts?.forEach((chart: any) => {
    markdown += `- ${chart.title} (${chart.chart_type})\n`
  })

  markdown += `\n## Insights\n`
  dashboard.insights?.forEach((insight: any) => {
    markdown += `### ${insight.title}\n${insight.content}\n\n`
  })

  return NextResponse.json({ markdown }) // ✅ MUST RETURN THIS
}