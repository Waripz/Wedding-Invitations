import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('rsvp')
        .select('name, wishes, created_at')
        .not('wishes', 'is', null)
        .neq('wishes', '')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ data });
    }

    // Return empty when no database is configured
    return NextResponse.json({ data: [] });
  } catch (err) {
    return NextResponse.json({ error: 'Ralat pelayan' }, { status: 500 });
  }
}
