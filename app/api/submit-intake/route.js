import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { localStore } from '@/lib/store';
import { sendTelegramNotification } from '@/lib/telegram';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const data = await request.json();

    const order_id = data.order_id || `TR-${Math.floor(100000 + Math.random() * 900000)}`;

    // Format structured notes so questionnaire details are permanently stored even if Supabase schema lacks extra columns
    const extraDetails = [];
    if (data.must_see) extraDetails.push(`🏛️ Must-See Sights: ${data.must_see}`);
    if (data.place_types) extraDetails.push(`🧭 Places to Roam: ${data.place_types}`);
    if (data.avoid_places) extraDetails.push(`🚫 Places to Avoid: ${data.avoid_places}`);
    
    let formattedNotes = data.notes || '';
    if (extraDetails.length > 0) {
      formattedNotes = formattedNotes 
        ? `${extraDetails.join('\n')}\n\n📝 Notes: ${formattedNotes}`
        : extraDetails.join('\n');
    }

    const basePayload = {
      order_id: order_id,
      status: 'New',
      dest_primary: data.dest_primary || '',
      dest_secondary: data.dest_secondary || null,
      plan_interest: data.plan_interest || null,
      date_start: data.date_start ? data.date_start : null,
      date_end: data.date_end ? data.date_end : null,
      traveller_count: Number(data.traveller_count) || 1,
      num_adults: Number(data.num_adults) || 1,
      num_seniors: Number(data.num_seniors) || 0,
      ages_seniors: data.ages_seniors || null,
      num_kids: Number(data.num_kids) || 0,
      ages_kids: data.ages_kids || null,
      pace: data.pace || null,
      accommodation: data.accommodation || null,
      mob_walker: Boolean(data.mob_walker),
      mob_wheelchair: Boolean(data.mob_wheelchair),
      mob_stairs: Boolean(data.mob_stairs),
      mob_stroller: Boolean(data.mob_stroller),
      dietary: data.dietary || null,
      notes: formattedNotes || null,
      client_name: data.client_name || '',
      client_email: data.client_email || '',
    };

    let recordToSave = {
      id: `req-${Date.now()}`,
      created_at: new Date().toISOString(),
      must_see: data.must_see || null,
      place_types: data.place_types || null,
      avoid_places: data.avoid_places || null,
      ...basePayload,
    };

    const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    if (!isPlaceholder) {
      try {
        // First try inserting basePayload (guaranteed to match existing Supabase columns)
        const { data: insertedRows, error } = await supabase
          .from('itinerary_requests')
          .insert([basePayload])
          .select();

        if (error) {
          console.error('Supabase insert error with basePayload:', error.message);
        } else if (insertedRows && insertedRows.length > 0) {
          recordToSave = {
            ...recordToSave,
            ...insertedRows[0],
            must_see: data.must_see || null,
            place_types: data.place_types || null,
            avoid_places: data.avoid_places || null,
          };
          console.log('Successfully saved intake record to Supabase, order_id:', order_id);
        }
      } catch (dbErr) {
        console.error('Supabase connection error:', dbErr.message);
      }
    }

    // Save to local cache
    localStore.add(recordToSave);

    // Trigger instant Telegram notification & customer confirmation email in parallel
    await Promise.allSettled([
      sendTelegramNotification(recordToSave).catch(e => console.error('Telegram dispatch error:', e.message)),
      sendOrderConfirmationEmail(recordToSave).catch(e => console.error('Email dispatch error:', e.message))
    ]);

    return NextResponse.json({ success: true, order_id }, { status: 200 });

  } catch (err) {
    console.error('Server error processing intake form:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
