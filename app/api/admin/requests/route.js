import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { localStore } from '@/lib/store';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  if (isPlaceholder) {
    return NextResponse.json({
      requests: localStore.getAll()
    }, { status: 200 });
  }

  try {
    const { data, error } = await supabase
      .from('itinerary_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase error, returning local fallback:', error);
      return NextResponse.json({ requests: localStore.getAll() }, { status: 200 });
    }

    return NextResponse.json({ requests: data || [] }, { status: 200 });
  } catch (err) {
    console.warn('Server error fetching Supabase, returning local fallback:', err);
    return NextResponse.json({ requests: localStore.getAll() }, { status: 200 });
  }
}
