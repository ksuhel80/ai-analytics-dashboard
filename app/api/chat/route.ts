import { createServerSupabase } from '@/lib/supabase/server'
import { answerDataQuestion } from '@/lib/ai/groq'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const dashboardId = searchParams.get('dashboardId')
  
  const supabase = await createServerSupabase()
  const { data, error } = await supabase
    .from('data_chats')
    .select('*')
    .eq('dashboard_id', dashboardId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { dashboardId, question, history } = await req.json()

  // 1. Get data context
  const { data: dashboard } = await supabase
    .from('dashboards')
    .select('*, dataset:datasets(*)')
    .eq('id', dashboardId)
    .single()

  if (!dashboard?.dataset) return NextResponse.json({ error: 'Data not found' }, { status: 404 })

  try {
    // 2. Ask AI
    const result = await answerDataQuestion(
      question,
      dashboard.dataset.columns,
      dashboard.dataset.preview_data,
      history
    )

    // 3. Save chat messages
    const userMsg = {
      dashboard_id: dashboardId,
      user_id: user.id,
      role: 'user',
      content: question
    }
    
    const aiMsg = {
      dashboard_id: dashboardId,
      user_id: user.id,
      role: 'assistant',
      content: result.answer,
      chart_suggestion: result.chartSuggestion
    }

    await supabase.from('data_chats').insert([userMsg, aiMsg])

    return NextResponse.json({
      ...aiMsg,
      id: Date.now().toString(), // Temp ID for immediate UI update
      created_at: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
