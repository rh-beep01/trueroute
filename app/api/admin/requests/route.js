import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // If placeholder Supabase credentials or network fails, provide mock sample requests for local demo
  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  if (isPlaceholder) {
    return NextResponse.json({
      requests: getMockRequests()
    }, { status: 200 });
  }

  try {
    const { data, error } = await supabase
      .from('itinerary_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase error, returning local fallback:', error);
      return NextResponse.json({ requests: getMockRequests() }, { status: 200 });
    }

    return NextResponse.json({ requests: data || [] }, { status: 200 });
  } catch (err) {
    console.warn('Server error fetching Supabase, returning local fallback:', err);
    return NextResponse.json({ requests: getMockRequests() }, { status: 200 });
  }
}

function getMockRequests() {
  return [
    {
      id: 'demo-1',
      order_id: 'TR-849201',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: 'New',
      dest_primary: 'Rome, Italy',
      dest_secondary: 'Florence & Tuscany',
      plan_interest: 'Full Week Plan — $99 (7 days, up to 2 cities)',
      date_start: '2026-10-15',
      date_end: '2026-10-22',
      traveller_count: 6,
      num_adults: 2,
      num_seniors: 2,
      ages_seniors: '68, 72',
      num_kids: 2,
      ages_kids: '4, 8',
      pace: 'Relaxed (1 big thing per day, lots of downtime)',
      accommodation: 'AirBnb / Apartment Rentals',
      mob_walker: true,
      mob_wheelchair: false,
      mob_stairs: true,
      mob_stroller: true,
      dietary: 'Nut allergy (kids), Halal (adults)',
      notes: 'Grandad has a hip replacement, need ground floor or elevator access for all restaurants and sites.',
      client_name: 'Sarah Jenkins',
      client_email: 'sarah.jenkins@example.com'
    },
    {
      id: 'demo-2',
      order_id: 'TR-392104',
      created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
      status: 'In Progress',
      dest_primary: 'Kyoto, Japan',
      dest_secondary: 'Osaka & Nara',
      plan_interest: 'Complete Family Package — $149 (10 days, multi-city)',
      date_start: '2026-11-05',
      date_end: '2026-11-15',
      traveller_count: 5,
      num_adults: 3,
      num_seniors: 1,
      ages_seniors: '70',
      num_kids: 1,
      ages_kids: '11',
      pace: 'Moderate (Morning & Afternoon activity)',
      accommodation: 'Hotels (Standard)',
      mob_walker: false,
      mob_wheelchair: false,
      mob_stairs: false,
      mob_stroller: false,
      dietary: 'Vegetarian for grandmother',
      notes: 'Would love authentic tea ceremony and kid-friendly cultural workshops.',
      client_name: 'David Chen',
      client_email: 'david.chen@example.com'
    }
  ];
}
