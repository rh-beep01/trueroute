import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { localStore } from '@/lib/store';
import { sendPaymentVerifiedEmail } from '@/lib/email';

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, status, sendEmail } = await request.json().catch(() => ({}));
  
  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
  }

  localStore.updateStatus(id, status);

  let targetRecord = localStore.get(id);

  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  if (!isPlaceholder) {
    try {
      const { data: updatedData, error } = await supabase
        .from('itinerary_requests')
        .update({ status })
        .eq('id', id)
        .select();

      if (!error && updatedData && updatedData.length > 0) {
        targetRecord = updatedData[0];
      }
    } catch (err) {
      console.warn('Supabase update status error:', err);
    }
  }

  // Trigger payment confirmation email if requested or if status set to 'In Progress' / 'Completed'
  if (sendEmail || status === 'In Progress') {
    if (targetRecord && targetRecord.client_email) {
      try {
        await sendPaymentVerifiedEmail(targetRecord);
      } catch (emailErr) {
        console.error('Error sending payment verified email:', emailErr);
      }
    }
  }

  return NextResponse.json({ success: true, record: targetRecord }, { status: 200 });
}
