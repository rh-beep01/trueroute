import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { localStore } from '@/lib/store';

function normalizeRequest(r) {
  if (!r) return r;
  let must_see = r.must_see || '';
  let place_types = r.place_types || '';
  let avoid_places = r.avoid_places || '';
  let notes = r.notes || '';

  if (notes) {
    const mustSeeMatch = notes.match(/🏛️ Must-See Sights:\s*([^\n]+)/);
    if (mustSeeMatch && !must_see) must_see = mustSeeMatch[1].trim();

    const placeTypesMatch = notes.match(/🧭 Places to Roam:\s*([^\n]+)/);
    if (placeTypesMatch && !place_types) place_types = placeTypesMatch[1].trim();

    const avoidMatch = notes.match(/🚫 Places to Avoid:\s*([^\n]+)/);
    if (avoidMatch && !avoid_places) avoid_places = avoidMatch[1].trim();

    const addNotesMatch = notes.match(/📝 Notes:\s*([\s\S]+)/);
    if (addNotesMatch) {
      notes = addNotesMatch[1].trim();
    } else if (mustSeeMatch || placeTypesMatch || avoidMatch) {
      notes = notes
        .replace(/🏛️ Must-See Sights:\s*[^\n]+\n*/g, '')
        .replace(/🧭 Places to Roam:\s*[^\n]+\n*/g, '')
        .replace(/🚫 Places to Avoid:\s*[^\n]+\n*/g, '')
        .trim();
    }
  }

  return {
    ...r,
    must_see: must_see || null,
    place_types: place_types || null,
    avoid_places: avoid_places || null,
    notes: notes || null,
  };
}

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (!token || token !== expectedPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  if (isPlaceholder) {
    return NextResponse.json({
      requests: localStore.getAll().map(normalizeRequest)
    }, { status: 200 });
  }

  try {
    const { data, error } = await supabase
      .from('itinerary_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase error, returning local fallback:', error);
      return NextResponse.json({ requests: localStore.getAll().map(normalizeRequest) }, { status: 200 });
    }

    const normalizedData = (data || []).map(normalizeRequest);
    return NextResponse.json({ requests: normalizedData }, { status: 200 });
  } catch (err) {
    console.warn('Server error fetching Supabase, returning local fallback:', err);
    return NextResponse.json({ requests: localStore.getAll().map(normalizeRequest) }, { status: 200 });
  }
}
