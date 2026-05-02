import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Toggle pin status
  const { data: current } = await supabase
    .from('dashboards')
    .select('is_pinned')
    .eq('id', params.id)
    .single()

  const { data, error } = await supabase
    .from('dashboards')
    .update({ is_pinned: !current?.is_pinned })
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
