import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { localStore } from '@/lib/store';
import { sendPaymentVerifiedEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (!token || token !== expectedPassword) {
      console.warn('Admin status update unauthorized. Token mismatch.');
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin Password' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { id, status, sendEmail, ...fallbackDetails } = body;
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status in request body' }, { status: 400 });
    }

    // 1. Update in local memory store
    localStore.updateStatus(id, status);
    let targetRecord = localStore.get(id);

    // Merge any client-passed fallback details to ensure we always have email & name
    if (!targetRecord) {
      targetRecord = { id, status, ...fallbackDetails };
    } else {
      targetRecord = { ...targetRecord, ...fallbackDetails, status };
    }

    // 2. Update in Supabase if configured
    const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    if (!isPlaceholder) {
      try {
        let updatedData = null;

        // Try updating by order_id or id
        const { data: res1, error: err1 } = await supabase
          .from('itinerary_requests')
          .update({ status })
          .eq('order_id', id)
          .select();

        if (!err1 && res1 && res1.length > 0) {
          updatedData = res1[0];
        } else {
          const { data: res2, error: err2 } = await supabase
            .from('itinerary_requests')
            .update({ status })
            .eq('id', id)
            .select();
          if (!err2 && res2 && res2.length > 0) {
            updatedData = res2[0];
          }
        }

        if (updatedData) {
          targetRecord = { ...targetRecord, ...updatedData };
        }
      } catch (dbErr) {
        console.warn('Supabase DB update warning:', dbErr.message);
      }
    }

    // 3. Trigger email if requested or if status is 'Payment Verified'
    let emailResult = null;
    if (sendEmail || status === 'Payment Verified') {
      if (targetRecord && targetRecord.client_email) {
        console.log(`Sending payment verified email to ${targetRecord.client_email} for order ${targetRecord.order_id || id}...`);
        emailResult = await sendPaymentVerifiedEmail(targetRecord);
        if (!emailResult?.success) {
          console.error('sendPaymentVerifiedEmail returned non-success:', emailResult);
        }
      } else {
        console.warn('Cannot send email: No client_email found on record', targetRecord);
        return NextResponse.json({
          success: true,
          statusUpdated: true,
          emailWarning: 'Status was updated, but no client email address was found to send confirmation.'
        }, { status: 200 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      record: targetRecord, 
      emailResult 
    }, { status: 200 });

  } catch (err) {
    console.error('Unhandled server error in update-status:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
