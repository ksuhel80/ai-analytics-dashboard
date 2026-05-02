import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createServerSupabase()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  // 🔥 Extract properly
  const {
    name,
    file_name,
    columns,
    row_count,
    column_count,
    preview, // 👈 frontend sends this
  } = body

  // ✅ Validate
  if (!name || !preview) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  // 🔥 FIX: map preview → preview_data
  const { data, error } = await supabase
    .from('datasets')
    .insert([
      {
        name,
        file_name,
        columns,
        row_count,
        column_count,
        preview_data: preview, // ✅ IMPORTANT FIX
        user_id: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Dataset insert error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}