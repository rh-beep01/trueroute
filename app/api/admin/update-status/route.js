import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const { error } = await supabase
      .from('itinerary_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Server error updating status:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
