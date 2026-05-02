import { createServerSupabase } from '@/lib/supabase/server'
import { analyzeDataset } from '@/lib/ai/groq'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ FIX TYPE
) {
  const { id } = await params // ✅ UNWRAP PARAMS

  const supabase = await createServerSupabase()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1. Get dashboard and dataset
  const { data: dashboard, error: dbError } = await supabase
    .from('dashboards')
    .select('*, dataset:datasets(*)')
    .eq('id', id) // ✅ USE id
    .single()

  if (dbError || !dashboard?.dataset) {
    return NextResponse.json(
      { error: 'Dashboard or dataset not found' },
      { status: 404 }
    )
  }

  // 2. Perform AI analysis
  try {
    const analysis = await analyzeDataset(
      dashboard.dataset.columns,
      dashboard.dataset.preview_data,
      dashboard.dataset.name
    )

    // 3. Save insights
    const insights = [
      { type: 'summary', title: 'Dataset Overview', content: analysis.summary },
      ...analysis.key_insights.map(i => ({ type: 'trend', title: 'Key Insight', content: i })),
      ...analysis.anomalies.map(a => ({ type: 'anomaly', title: 'Data Anomaly', content: a })),
      ...analysis.trends.map(t => ({ type: 'trend', title: 'Trend Detected', content: t })),
      ...analysis.recommendations.map(r => ({ type: 'recommendation', title: 'Recommendation', content: r }))
    ].map(i => ({
      ...i,
      dashboard_id: id, // ✅ FIX
      user_id: user.id
    }))

    // Clear old insights
    await supabase.from('insights').delete().eq('dashboard_id', id)

    // Insert new insights
    const { error: insError } = await supabase.from('insights').insert(insights)

    if (insError) throw insError

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error("Analyze error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
