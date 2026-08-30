import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const data = await request.json();

    const order_id = data.order_id || `TR-${Math.floor(100000 + Math.random() * 900000)}`;

    const { error } = await supabase
      .from('itinerary_requests')
      .insert([
        {
          order_id: order_id,
          dest_primary: data.dest_primary,
          dest_secondary: data.dest_secondary,
          plan_interest: data.plan_interest,
          date_start: data.date_start,
          date_end: data.date_end,
          traveller_count: data.traveller_count,
          num_adults: data.num_adults,
          num_seniors: data.num_seniors,
          ages_seniors: data.ages_seniors,
          num_kids: data.num_kids,
          ages_kids: data.ages_kids,
          pace: data.pace,
          accommodation: data.accommodation,
          mob_walker: data.mob_walker,
          mob_wheelchair: data.mob_wheelchair,
          mob_stairs: data.mob_stairs,
          mob_stroller: data.mob_stroller,
          dietary: data.dietary,
          notes: data.notes,
          client_name: data.client_name,
          client_email: data.client_email,
        }
      ]);

    if (error) {
      console.error('Error inserting into Supabase:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order_id }, { status: 200 });

  } catch (err) {
    console.error('Server error processing intake form:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
