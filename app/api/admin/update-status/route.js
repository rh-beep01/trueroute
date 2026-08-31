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
      // 1. Try update by primary key ID or order_id
      const { data: updatedData, error } = await supabase
        .from('itinerary_requests')
        .update({ status })
        .eq('id', id)
        .select();

      if (!error && updatedData && updatedData.length > 0) {
        targetRecord = updatedData[0];
      } else {
        // Fallback: try update by order_id
        const { data: byOrder, error: orderErr } = await supabase
          .from('itinerary_requests')
          .update({ status })
          .eq('order_id', id)
          .select();
        if (!orderErr && byOrder && byOrder.length > 0) {
          targetRecord = byOrder[0];
        }
      }
    } catch (err) {
      console.warn('Supabase update status error:', err);
    }
  }

  // Trigger payment confirmation email if requested or if status set to 'Payment Verified'
  let emailResult = null;
  if (sendEmail || status === 'Payment Verified') {
    if (targetRecord && targetRecord.client_email) {
      try {
        emailResult = await sendPaymentVerifiedEmail(targetRecord);
      } catch (emailErr) {
        console.error('Error sending payment verified email:', emailErr);
      }
    } else {
      console.warn('Cannot send payment verified email: targetRecord or client_email missing for id:', id);
    }
  }

  return NextResponse.json({ success: true, record: targetRecord, emailResult }, { status: 200 });
}
