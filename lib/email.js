import { Resend } from 'resend';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/roamify.life/',
  facebook: 'https://www.facebook.com/share/1FQTVLfs94/',
  whatsapp: 'https://wa.me/message/N3LN7Y5F5DFHA1',
  email: 'mailto:hello@roamify.life',
  website: 'https://roamify.life',
};

function getPaymentUrl(planInterest) {
  const plan = (planInterest || '').toLowerCase();
  if (plan.includes('49') || plan.includes('weekend')) {
    return 'https://roamify01.gumroad.com/l/family-itinerary01?wanted=true';
  } else if (plan.includes('99') || plan.includes('week')) {
    return 'https://roamify01.gumroad.com/l/fullweek?wanted=true';
  } else if (plan.includes('149') || plan.includes('complete') || plan.includes('extended')) {
    return 'https://roamify01.gumroad.com/l/ExtendedTrip?wanted=true';
  }
  return 'https://roamify01.gumroad.com/l/fullweek?wanted=true';
}

function getPackageTimeline(planInterest) {
  const plan = (planInterest || '').toLowerCase();
  if (plan.includes('49') || plan.includes('weekend')) {
    return '2–3 Days';
  } else if (plan.includes('99') || plan.includes('week')) {
    return '3–5 Days';
  } else if (plan.includes('149') || plan.includes('complete') || plan.includes('extended')) {
    return '5–7 Days';
  }
  return '5–7 Days';
}

function renderSocialFooter() {
  return `
    <div style="margin-top:24px; padding-top:20px; border-top:1px solid #E2E8F0; text-align:center;">
      <p style="margin:0 0 14px 0; font-size:12px; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.5px;">Follow Us</p>
      <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto;">
        <tr>
          <!-- Instagram -->
          <td style="padding:0 8px;">
            <a href="${SOCIAL_LINKS.instagram}" style="display:inline-block; text-decoration:none; text-align:center;">
              <img src="https://roamify.life/logos/instagram.svg" width="36" height="36" alt="Instagram" style="display:block; border-radius:10px; border:0;" />
              <span style="display:block; font-size:10px; font-weight:600; color:#64748B; margin-top:4px;">Instagram</span>
            </a>
          </td>
          <!-- Facebook -->
          <td style="padding:0 8px;">
            <a href="${SOCIAL_LINKS.facebook}" style="display:inline-block; text-decoration:none; text-align:center;">
              <img src="https://roamify.life/logos/facebook.svg" width="36" height="36" alt="Facebook" style="display:block; border-radius:10px; border:0;" />
              <span style="display:block; font-size:10px; font-weight:600; color:#64748B; margin-top:4px;">Facebook</span>
            </a>
          </td>
          <!-- WhatsApp -->
          <td style="padding:0 8px;">
            <a href="${SOCIAL_LINKS.whatsapp}" style="display:inline-block; text-decoration:none; text-align:center;">
              <img src="https://roamify.life/logos/whatsapp.svg" width="36" height="36" alt="WhatsApp" style="display:block; border-radius:10px; border:0;" />
              <span style="display:block; font-size:10px; font-weight:600; color:#64748B; margin-top:4px;">WhatsApp</span>
            </a>
          </td>
        </tr>
      </table>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL 1: INTAKE DETAILS RECEIVED (Initial Request Confirmation)
// ─────────────────────────────────────────────────────────────────────────────
export async function sendOrderConfirmationEmail(data) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes('placeholder')) {
    console.warn('Resend email skipped: RESEND_API_KEY is not configured.');
    return { success: false, reason: 'missing_api_key' };
  }

  if (!data.client_email) {
    console.warn('Resend email skipped: No client email provided.');
    return { success: false, reason: 'no_email' };
  }

  const resend = new Resend(apiKey);

  const orderId = escapeHtml(data.order_id || 'N/A');
  const clientName = escapeHtml(data.client_name || 'Valued Traveler');
  const clientEmail = data.client_email;
  const destPrimary = escapeHtml(data.dest_primary || 'N/A');
  const destSecondary = escapeHtml(data.dest_secondary || '');
  const planInterest = escapeHtml(data.plan_interest || 'Family Itinerary Package');
  const dateStart = escapeHtml(data.date_start || 'N/A');
  const dateEnd = escapeHtml(data.date_end || 'N/A');
  const pace = escapeHtml(data.pace || 'Standard & Balanced');
  const accommodation = escapeHtml(data.accommodation || 'No preference specified');
  const dietary = escapeHtml(data.dietary || 'None specified');
  const notes = escapeHtml(data.notes || 'None');
  const seniorAges = escapeHtml(data.ages_seniors || '');
  const kidAges = escapeHtml(data.ages_kids || '');
  const paymentUrl = getPaymentUrl(data.plan_interest);

  const mobilityList = [
    data.mob_walker ? '🦯 Walker / Cane Accessible' : null,
    data.mob_wheelchair ? '♿ Step-Free / Wheelchair' : null,
    data.mob_stairs ? '🚫 Avoid Steep Stairs' : null,
    data.mob_stroller ? '👶 Stroller Friendly Routes' : null,
  ].filter(Boolean);

  const mobilityHtml = mobilityList.length > 0
    ? mobilityList.map(m => `<span style="display:inline-block; background:#E8F2EC; color:#2E6F40; font-size:12px; font-weight:600; padding:3px 8px; border-radius:6px; margin:2px 4px 2px 0;">${m}</span>`).join('')
    : '<span style="color:#64748B;">Standard routing</span>';

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Roamify <orders@roamify.life>';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trip Details Received - Roamify</title>
</head>
<body style="margin:0; padding:0; background-color:#FAFAF7; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#0F172A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#FAFAF7; padding:30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; background:#FFFFFF; border-radius:16px; overflow:hidden; border:1px solid #E2E8F0; box-shadow:0 4px 20px rgba(15,23,42,0.06);">
          
          <!-- Accent Line -->
          <tr>
            <td style="height:6px; background:linear-gradient(90deg, #E05A47 0%, #DFB15B 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:32px 36px 20px 36px; text-align:center;">
              <h1 style="margin:0 0 6px 0; font-size:24px; font-weight:800; color:#0F172A; letter-spacing:-0.5px;">
                ✈️ Roamify
              </h1>
              <p style="margin:0; font-size:14px; color:#64748B; font-weight:500;">
                Custom Multi-Generational Family Itineraries
              </p>
            </td>
          </tr>

          <!-- Status Banner -->
          <tr>
            <td style="padding:0 36px 24px 36px;">
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:24px; text-align:center;">
                <span style="display:inline-block; background:#E8F2EC; color:#2E6F40; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; padding:4px 10px; border-radius:20px; margin-bottom:12px;">
                  ✓ Trip Request Received
                </span>
                <h2 style="margin:0 0 8px 0; font-size:20px; font-weight:700; color:#0F172A;">
                  We Received Your Trip Details!
                </h2>
                <p style="margin:0 0 16px 0; font-size:14px; line-height:1.6; color:#475569;">
                  Hi <strong>${clientName}</strong>, thank you for submitting your travel preferences. Our family travel specialists are ready to begin crafting your custom itinerary.
                </p>
                <div style="display:inline-block; background:#FFFFFF; border:1px dashed #CBD5E1; border-radius:8px; padding:8px 16px;">
                  <span style="font-size:12px; color:#64748B;">Order Reference ID:</span>
                  <strong style="font-size:14px; color:#E05A47; font-family:monospace; margin-left:6px;">${orderId}</strong>
                </div>
              </div>
            </td>
          </tr>

          <!-- Payment Notice & CTA Box -->
          <tr>
            <td style="padding:0 36px 24px 36px;">
              <div style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:12px; padding:20px; text-align:center;">
                <h3 style="margin:0 0 8px 0; font-size:15px; font-weight:700; color:#92400E;">
                  💳 Complete Your Package Payment
                </h3>
                <p style="margin:0 0 16px 0; font-size:13px; line-height:1.5; color:#78350F;">
                  If you haven't completed checkout yet for your <strong>${planInterest}</strong>, click below to finalize your order securely via Gumroad:
                </p>
                <a href="${paymentUrl}" style="display:inline-block; background:#E05A47; color:#FFFFFF; text-decoration:none; font-size:14px; font-weight:700; padding:12px 28px; border-radius:8px; box-shadow:0 2px 8px rgba(224,90,71,0.3);">
                  Proceed to Secure Checkout &rarr;
                </a>
                
                <div style="margin-top:16px; padding-top:14px; border-top:1px dashed #FCD34D; font-size:12px; color:#92400E; line-height:1.5; text-align:left;">
                  ℹ️ <strong>Already completed payment?</strong> Please allow <strong>6–12 hours</strong> for our team to verify your transaction. You will receive a separate <strong>Payment &amp; Production Confirmation</strong> email as soon as it is verified!
                </div>
              </div>
            </td>
          </tr>

          <!-- Trip Summary Table -->
          <tr>
            <td style="padding:0 36px 24px 36px;">
              <h3 style="margin:0 0 12px 0; font-size:15px; font-weight:700; color:#0F172A; text-transform:uppercase; letter-spacing:0.5px;">
                📋 Summary of Received Details
              </h3>
              <table width="100%" cellspacing="0" cellpadding="8" style="font-size:13px; border-collapse:collapse; background:#FFFFFF; border:1px solid #F1F5F9; border-radius:8px;">
                <tr style="border-bottom:1px solid #F1F5F9;">
                  <td style="color:#64748B; width:35%; font-weight:600;">Destination:</td>
                  <td style="color:#0F172A; font-weight:700;">${destPrimary}${destSecondary ? ` &rarr; ${destSecondary}` : ''}</td>
                </tr>
                <tr style="border-bottom:1px solid #F1F5F9;">
                  <td style="color:#64748B; font-weight:600;">Selected Plan:</td>
                  <td style="color:#0F172A; font-weight:600;">${planInterest}</td>
                </tr>
                <tr style="border-bottom:1px solid #F1F5F9;">
                  <td style="color:#64748B; font-weight:600;">Travel Dates:</td>
                  <td style="color:#0F172A;">${dateStart} to ${dateEnd}</td>
                </tr>
                <tr style="border-bottom:1px solid #F1F5F9;">
                  <td style="color:#64748B; font-weight:600;">Party Size:</td>
                  <td style="color:#0F172A;">
                    ${data.traveller_count || 0} Travelers (${data.num_adults || 0} Adults, ${data.num_seniors || 0} Seniors, ${data.num_kids || 0} Kids)
                    ${seniorAges ? `<br><small style="color:#64748B;">Senior ages: ${seniorAges}</small>` : ''}
                    ${kidAges ? `<br><small style="color:#64748B;">Kids ages: ${kidAges}</small>` : ''}
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #F1F5F9;">
                  <td style="color:#64748B; font-weight:600;">Pace:</td>
                  <td style="color:#0F172A;">${pace}</td>
                </tr>
                <tr style="border-bottom:1px solid #F1F5F9;">
                  <td style="color:#64748B; font-weight:600;">Accessibility:</td>
                  <td style="color:#0F172A;">${mobilityHtml}</td>
                </tr>
                <tr style="border-bottom:1px solid #F1F5F9;">
                  <td style="color:#64748B; font-weight:600;">Accommodation:</td>
                  <td style="color:#0F172A;">${accommodation}</td>
                </tr>
                ${dietary !== 'None specified' ? `
                <tr style="border-bottom:1px solid #F1F5F9;">
                  <td style="color:#64748B; font-weight:600;">Dietary Needs:</td>
                  <td style="color:#0F172A;">${dietary}</td>
                </tr>` : ''}
                ${notes !== 'None' ? `
                <tr>
                  <td style="color:#64748B; font-weight:600;">Special Notes:</td>
                  <td style="color:#0F172A;">${notes}</td>
                </tr>` : ''}
              </table>
            </td>
          </tr>

          <!-- Social Links -->
          <tr>
            <td style="padding:0 36px 20px 36px;">
              ${renderSocialFooter()}
            </td>
          </tr>

          <!-- Support & Questions -->
          <tr>
            <td style="padding:0 36px 24px 36px; text-align:center;">
              <p style="margin:0 0 8px 0; font-size:13px; color:#64748B;">
                Need to add extra details or adjust dates? Contact us through:
              </p>
              <p style="margin:0; font-size:13px; color:#64748B;">
                📧 <a href="mailto:hello@roamify.life" style="color:#E05A47; font-weight:600; text-decoration:none;">hello@roamify.life</a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                💬 <a href="https://wa.me/message/N3LN7Y5F5DFHA1" style="color:#25D366; font-weight:600; text-decoration:none;">WhatsApp Us</a>
              </p>
              <p style="margin:12px 0 0 0; font-size:11px; color:#94A3B8;">This is an automated email. Please do not reply directly to this message.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC; border-top:1px solid #E2E8F0; padding:20px 36px; text-align:center; font-size:12px; color:#94A3B8;">
              <p style="margin:0 0 4px 0;">© 2026 Roamify. Designed with care for families worldwide.</p>
              <p style="margin:0;">100% Satisfaction Guarantee • Serving US, UK, EU, Canada &amp; Australia</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    let response = await resend.emails.send({
      from: fromEmail,
      to: [clientEmail],
      subject: `📋 We Received Your Trip Details! [Order #${orderId}]`,
      html: htmlContent,
    });

    if (response.error && fromEmail !== 'Roamify <onboarding@resend.dev>') {
      response = await resend.emails.send({
        from: 'Roamify <onboarding@resend.dev>',
        to: [clientEmail],
        subject: `📋 We Received Your Trip Details! [Order #${orderId}]`,
        html: htmlContent,
      });
    }

    if (response.error) {
      console.error('Resend email dispatch error:', response.error);
      return { success: false, error: response.error.message };
    }

    console.log('Details received confirmation email sent successfully to', clientEmail, 'Email ID:', response.data?.id);
    return { success: true, id: response.data?.id };
  } catch (err) {
    console.error('Failed to send details confirmation email:', err.message);
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL 2: PAYMENT VERIFIED & PRODUCTION TIMELINE (Triggered via Admin)
// ─────────────────────────────────────────────────────────────────────────────
export async function sendPaymentVerifiedEmail(data) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes('placeholder')) {
    console.warn('Resend email skipped: RESEND_API_KEY is not configured.');
    return { success: false, reason: 'missing_api_key' };
  }

  if (!data.client_email) {
    console.warn('Resend email skipped: No client email provided.');
    return { success: false, reason: 'no_email' };
  }

  const resend = new Resend(apiKey);

  const orderId = escapeHtml(data.order_id || 'N/A');
  const clientName = escapeHtml(data.client_name || 'Valued Traveler');
  const clientEmail = data.client_email;
  const destPrimary = escapeHtml(data.dest_primary || 'N/A');
  const planInterest = escapeHtml(data.plan_interest || 'Family Itinerary Package');
  const timeline = getPackageTimeline(data.plan_interest);

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Roamify <orders@roamify.life>';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Confirmed - Roamify</title>
</head>
<body style="margin:0; padding:0; background-color:#FAFAF7; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#0F172A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#FAFAF7; padding:30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; background:#FFFFFF; border-radius:16px; overflow:hidden; border:1px solid #E2E8F0; box-shadow:0 4px 20px rgba(15,23,42,0.06);">
          
          <!-- Accent Line -->
          <tr>
            <td style="height:6px; background:linear-gradient(90deg, #2E6F40 0%, #DFB15B 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:32px 36px 20px 36px; text-align:center;">
              <h1 style="margin:0 0 6px 0; font-size:24px; font-weight:800; color:#0F172A; letter-spacing:-0.5px;">
                ✈️ Roamify
              </h1>
              <p style="margin:0; font-size:14px; color:#64748B; font-weight:500;">
                Custom Multi-Generational Family Itineraries
              </p>
            </td>
          </tr>

          <!-- Status Banner -->
          <tr>
            <td style="padding:0 36px 24px 36px;">
              <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:12px; padding:24px; text-align:center;">
                <span style="display:inline-block; background:#DCFCE7; color:#166534; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; padding:4px 10px; border-radius:20px; margin-bottom:12px;">
                  🎉 Payment Verified &amp; Confirmed
                </span>
                <h2 style="margin:0 0 8px 0; font-size:20px; font-weight:700; color:#166534;">
                  Your Itinerary is Now in Production!
                </h2>
                <p style="margin:0 0 16px 0; font-size:14px; line-height:1.6; color:#15803D;">
                  Hi <strong>${clientName}</strong>, great news! We have successfully verified your payment for <strong>${destPrimary}</strong> (${planInterest}).
                </p>
                <div style="display:inline-block; background:#FFFFFF; border:1px solid #86EFAC; border-radius:8px; padding:8px 16px;">
                  <span style="font-size:12px; color:#166534;">Order ID:</span>
                  <strong style="font-size:14px; color:#2E6F40; font-family:monospace; margin-left:6px;">${orderId}</strong>
                </div>
              </div>
            </td>
          </tr>

          <!-- Delivery Timeline Box -->
          <tr>
            <td style="padding:0 36px 24px 36px;">
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:20px;">
                <h3 style="margin:0 0 12px 0; font-size:15px; font-weight:700; color:#0F172A; text-transform:uppercase; letter-spacing:0.5px;">
                  ⏱️ Delivery Timeline &amp; Next Steps
                </h3>
                <table width="100%" cellspacing="0" cellpadding="8" style="font-size:13px; border-collapse:collapse;">
                  <tr style="border-bottom:1px solid #E2E8F0;">
                    <td style="color:#64748B; font-weight:600; width:40%;">Selected Package:</td>
                    <td style="color:#0F172A; font-weight:700;">${planInterest}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #E2E8F0;">
                    <td style="color:#64748B; font-weight:600;">Expected Delivery:</td>
                    <td style="color:#2E6F40; font-weight:800; font-size:14px;">Within ${timeline}</td>
                  </tr>
                  <tr>
                    <td style="color:#64748B; font-weight:600;">Delivery Method:</td>
                    <td style="color:#0F172A;">PDF Guide + Map links of the locations sent to <strong>${clientEmail}</strong></td>
                  </tr>
                </table>

                <div style="margin-top:16px; padding:14px; background:#FFFFFF; border-radius:8px; border:1px solid #E2E8F0;">
                  <h4 style="margin:0 0 6px 0; font-size:13px; font-weight:700; color:#0F172A;">🛠️ What Our Specialists Are Doing Right Now:</h4>
                  <ul style="margin:0; padding-left:20px; font-size:12px; color:#475569; line-height:1.6;">
                    <li>Mapping accessible, step-free walking paths for toddlers and seniors.</li>
                    <li>Timing daily attractions to prevent travel fatigue.</li>
                    <li>Securing verified ticket links and reservation guidelines.</li>
                  </ul>
                </div>
              </div>
            </td>
          </tr>

          <!-- Social Links -->
          <tr>
            <td style="padding:0 36px 20px 36px;">
              ${renderSocialFooter()}
            </td>
          </tr>

          <!-- Support & Questions -->
          <tr>
            <td style="padding:0 36px 24px 36px; text-align:center;">
              <p style="margin:0 0 8px 0; font-size:13px; color:#64748B;">
                Have questions or need to make an adjustment while we build your plan? Contact us through:
              </p>
              <p style="margin:0; font-size:13px; color:#64748B;">
                📧 <a href="mailto:hello@roamify.life" style="color:#2E6F40; font-weight:600; text-decoration:none;">hello@roamify.life</a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                💬 <a href="https://wa.me/message/N3LN7Y5F5DFHA1" style="color:#25D366; font-weight:600; text-decoration:none;">WhatsApp Us</a>
              </p>
              <p style="margin:12px 0 0 0; font-size:11px; color:#94A3B8;">This is an automated email. Please do not reply directly to this message.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC; border-top:1px solid #E2E8F0; padding:20px 36px; text-align:center; font-size:12px; color:#94A3B8;">
              <p style="margin:0 0 4px 0;">© 2026 Roamify. Designed with care for families worldwide.</p>
              <p style="margin:0;">100% Satisfaction Guarantee • Serving US, UK, EU, Canada &amp; Australia</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    let response = await resend.emails.send({
      from: fromEmail,
      to: [clientEmail],
      subject: `🎉 Payment Confirmed: Your Family Itinerary is in Production! [Order #${orderId}]`,
      html: htmlContent,
    });

    if (response.error && fromEmail !== 'Roamify <onboarding@resend.dev>') {
      response = await resend.emails.send({
        from: 'Roamify <onboarding@resend.dev>',
        to: [clientEmail],
        subject: `🎉 Payment Confirmed: Your Family Itinerary is in Production! [Order #${orderId}]`,
        html: htmlContent,
      });
    }

    if (response.error) {
      console.error('Resend payment verified email error:', response.error);
      return { success: false, error: response.error.message };
    }

    console.log('Payment verified email sent successfully to', clientEmail, 'Email ID:', response.data?.id);
    return { success: true, id: response.data?.id };
  } catch (err) {
    console.error('Failed to send payment verified email:', err.message);
    return { success: false, error: err.message };
  }
}
