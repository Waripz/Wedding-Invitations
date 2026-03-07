import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, attendance, pax, wishes } = body;

    // Validate
    if (!name || !attendance) {
      return NextResponse.json(
        { error: 'Nama dan kehadiran diperlukan' },
        { status: 400 }
      );
    }

    // If Supabase is configured, save to database
    if (supabase) {
      // Check for duplicate name
      const { data: existing } = await supabase
        .from('rsvp')
        .select('id')
        .ilike('name', name.trim())
        .limit(1);

      if (existing && existing.length > 0) {
        return NextResponse.json(
          { error: 'Nama ini sudah didaftarkan / This name has already been registered' },
          { status: 409 }
        );
      }

      const { data, error } = await supabase
        .from('rsvp')
        .insert([
          {
            name: name.trim(),
            attendance,
            pax: parseInt(pax) || 1,
            wishes: wishes?.trim() || null,
          },
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json(
          { error: 'Gagal menyimpan. Sila cuba lagi.' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data });
    }

    // Fallback: just return success (no database configured)
    console.log('RSVP received (no database):', { name, attendance, pax, wishes });
    return NextResponse.json({
      success: true,
      data: { name, attendance, pax, wishes },
      message: 'RSVP diterima (tiada database dikonfigurasi)',
    });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Ralat pelayan. Sila cuba lagi.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('rsvp')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ data });
    }

    return NextResponse.json({ data: [], message: 'Tiada database dikonfigurasi' });
  } catch (err) {
    return NextResponse.json({ error: 'Ralat pelayan' }, { status: 500 });
  }
}
