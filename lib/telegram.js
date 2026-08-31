function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function sendTelegramNotification(data) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId || token.includes("placeholder") || chatId.includes("placeholder")) {
    console.warn("Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured.");
    return;
  }

  const mobilityList = [
    data.mob_walker ? "🦯 Walker/Cane" : null,
    data.mob_wheelchair ? "♿ Wheelchair" : null,
    data.mob_stairs ? "🚫 No Stairs" : null,
    data.mob_stroller ? "👶 Stroller" : null,
  ].filter(Boolean);

  const mobilityText = mobilityList.length > 0 ? mobilityList.join(", ") : "None";

  const orderId = escapeHtml(data.order_id || "N/A");
  const clientName = escapeHtml(data.client_name || "N/A");
  const clientEmail = escapeHtml(data.client_email || "N/A");
  const destPrimary = escapeHtml(data.dest_primary || "N/A");
  const destSecondary = escapeHtml(data.dest_secondary || "");
  const planInterest = escapeHtml(data.plan_interest || "N/A");
  const dateStart = escapeHtml(data.date_start || "N/A");
  const dateEnd = escapeHtml(data.date_end || "N/A");
  const pace = escapeHtml(data.pace || "Standard");
  const accommodation = escapeHtml(data.accommodation || "No preference");
  const dietary = escapeHtml(data.dietary || "None");
  const notes = escapeHtml(data.notes || "None");
  const seniorAges = escapeHtml(data.ages_seniors || "");
  const kidAges = escapeHtml(data.ages_kids || "");

  const message = `🚨 <b>NEW ROAMIFY ORDER RECEIVED!</b>

🆔 <b>Order ID:</b> <code>${orderId}</code>
👤 <b>Client:</b> ${clientName}
✉️ <b>Email:</b> ${clientEmail}

📍 <b>Destination:</b> ${destPrimary}${destSecondary ? ` → ${destSecondary}` : ""}
💳 <b>Plan:</b> ${planInterest}
📅 <b>Dates:</b> ${dateStart} to ${dateEnd}

👥 <b>Travelers:</b> ${data.traveller_count || 0} (${data.num_adults || 0} Adults, ${data.num_seniors || 0} Seniors, ${data.num_kids || 0} Kids)
${seniorAges ? `👴 <b>Senior Ages:</b> ${seniorAges}\n` : ""}${kidAges ? `🧒 <b>Kids Ages:</b> ${kidAges}\n` : ""}🏃 <b>Pace:</b> ${pace}
🏨 <b>Accommodation:</b> ${accommodation}
♿ <b>Mobility:</b> ${mobilityText}
🥗 <b>Dietary:</b> ${dietary}
📝 <b>Notes:</b> ${notes}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const result = await res.json();
    if (!res.ok || !result.ok) {
      console.error("Telegram API error response:", result);
    } else {
      console.log("Telegram notification sent successfully. Message ID:", result.result?.message_id);
    }
  } catch (err) {
    console.error("Failed to send Telegram notification:", err.message);
  }
}