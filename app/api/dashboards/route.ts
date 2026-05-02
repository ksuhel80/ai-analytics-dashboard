import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('dashboards')
    .select('*, dataset:datasets(*), charts(*)')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = await createServerSupabase()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  // ✅ Extract only allowed fields
  const { name, description, dataset_id } = body

  if (!name || !dataset_id) {
    return NextResponse.json(
      { error: 'Missing required fields (name, dataset_id)' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('dashboards')
    .insert([
      {
        name,
        description,
        dataset_id,
        user_id: user.id,
        is_pinned: false,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Dashboard insert error:", error) // ✅ ADD THIS
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}