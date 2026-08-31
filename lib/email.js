import { Resend } from 'resend';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function sendOrderConfirmationEmail(data) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes('placeholder')) {
    console.warn('Resend email skipped: RESEND_API_KEY is not configured in environment variables.');
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

  const mobilityList = [
    data.mob_walker ? '🦯 Walker / Cane Accessible' : null,
    data.mob_wheelchair ? '♿ Step-Free / Wheelchair' : null,
    data.mob_stairs ? '🚫 Avoid Steep Stairs' : null,
    data.mob_stroller ? '👶 Stroller Friendly Routes' : null,
  ].filter(Boolean);

  const mobilityHtml = mobilityList.length > 0
    ? mobilityList.map(m => `<span style="display:inline-block; background:#E8F2EC; color:#2E6F40; font-size:12px; font-weight:600; padding:3px 8px; border-radius:6px; margin:2px 4px 2px 0;">${m}</span>`).join('')
    : '<span style="color:#64748B;">Standard routing</span>';

  // Sender email: Defaults to Resend verified onboarding sender or custom domain if configured
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Roamify Travel <onboarding@resend.dev>';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Roamify</title>
</head>
<body style="margin:0; padding:0; background-color:#FAFAF7; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#0F172A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#FAFAF7; padding:30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; background:#FFFFFF; border-radius:16px; overflow:hidden; border:1px solid #E2E8F0; box-shadow:0 4px 20px rgba(15,23,42,0.06);">
          
          <!-- Top Accent Bar -->
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

          <!-- Hero Greeting -->
          <tr>
            <td style="padding:0 36px 24px 36px;">
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:24px; text-align:center;">
                <span style="display:inline-block; background:#E8F2EC; color:#2E6F40; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; padding:4px 10px; border-radius:20px; margin-bottom:12px;">
                  ✓ Request Received
                </span>
                <h2 style="margin:0 0 8px 0; font-size:20px; font-weight:700; color:#0F172A;">
                  Your Family Adventure is in the Works!
                </h2>
                <p style="margin:0 0 16px 0; font-size:14px; line-height:1.6; color:#475569;">
                  Hi <strong>${clientName}</strong>, thank you for trusting Roamify. We have received your trip details and our team of family travel specialists is now reviewing your preferences.
                </p>
                <div style="display:inline-block; background:#FFFFFF; border:1px dashed #CBD5E1; border-radius:8px; padding:8px 16px;">
                  <span style="font-size:12px; color:#64748B;">Order Reference ID:</span>
                  <strong style="font-size:14px; color:#E05A47; font-family:monospace; margin-left:6px;">${orderId}</strong>
                </div>
              </div>
            </td>
          </tr>

          <!-- Trip Summary Table -->
          <tr>
            <td style="padding:0 36px 24px 36px;">
              <h3 style="margin:0 0 12px 0; font-size:15px; font-weight:700; color:#0F172A; text-transform:uppercase; letter-spacing:0.5px;">
                📋 Trip Summary
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

          <!-- Next Steps -->
          <tr>
            <td style="padding:0 36px 28px 36px;">
              <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:12px; padding:20px;">
                <h4 style="margin:0 0 8px 0; font-size:14px; font-weight:700; color:#166534;">
                  ⏱️ What Happens Next?
                </h4>
                <ol style="margin:0; padding-left:20px; font-size:13px; color:#15803D; line-height:1.6;">
                  <li style="margin-bottom:6px;">Our human planner curates pacing, kid/senior friendly rest stops, and accessible routes.</li>
                  <li style="margin-bottom:6px;">We verify restaurant recommendations, ticket booking links, and daily step counts.</li>
                  <li>Your custom PDF guide &amp; interactive digital map will arrive in your inbox within <strong>24–48 hours</strong>!</li>
                </ol>
              </div>
            </td>
          </tr>

          <!-- Support & Questions -->
          <tr>
            <td style="padding:0 36px 32px 36px; text-align:center;">
              <p style="margin:0 0 12px 0; font-size:13px; color:#64748B;">
                Need to add extra details or adjust your dates? Simply reply directly to this email or message us at:
              </p>
              <a href="mailto:hello@roamify.life?subject=Order%20Update%20${orderId}" style="display:inline-block; background:#0F172A; color:#FFFFFF; text-decoration:none; font-size:13px; font-weight:600; padding:10px 20px; border-radius:8px;">
                Contact Planning Team
              </a>
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
    const { data: result, error } = await resend.emails.send({
      from: fromEmail,
      to: [clientEmail],
      subject: `✈️ Your Family Itinerary Request is Confirmed! [Order #${orderId}]`,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend email dispatch error:', error);
      return { success: false, error: error.message };
    }

    console.log('Order confirmation email sent successfully to', clientEmail, 'Email ID:', result?.id);
    return { success: true, id: result?.id };
  } catch (err) {
    console.error('Failed to send order confirmation email:', err.message);
    return { success: false, error: err.message };
  }
}
