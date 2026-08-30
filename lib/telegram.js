export async function sendTelegramNotification(data) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId || token.includes("placeholder") || chatId.includes("placeholder")) {
    return;
  }

  const mobilityList = [
    data.mob_walker ? "🦯 Walker/Cane" : null,
    data.mob_wheelchair ? "♿ Wheelchair" : null,
    data.mob_stairs ? "🚫 No Stairs" : null,
    data.mob_stroller ? "👶 Stroller" : null,
  ].filter(Boolean);

  const mobilityText = mobilityList.length > 0 ? mobilityList.join(", ") : "None";

  const message = `🚨 <b>NEW TRUEROUTE ORDER RECEIVED!</b>

🆔 <b>Order ID:</b> <code>${data.order_id || "N/A"}</code>
👤 <b>Client:</b> ${data.client_name || "N/A"}
✉️ <b>Email:</b> ${data.client_email || "N/A"}

📍 <b>Destination:</b> ${data.dest_primary || "N/A"}${data.dest_secondary ? ` → ${data.dest_secondary}` : ""}
💳 <b>Plan:</b> ${data.plan_interest || "N/A"}
📅 <b>Dates:</b> ${data.date_start || "N/A"} to ${data.date_end || "N/A"}

👥 <b>Travelers:</b> ${data.traveller_count || 0} (${data.num_adults || 0} Adults, ${data.num_seniors || 0} Seniors, ${data.num_kids || 0} Kids)
${data.ages_seniors ? `👴 <b>Senior Ages:</b> ${data.ages_seniors}\n` : ""}${data.ages_kids ? `🧒 <b>Kids Ages:</b> ${data.ages_kids}\n` : ""}🏃 <b>Pace:</b> ${data.pace || "Standard"}
🏨 <b>Accommodation:</b> ${data.accommodation || "No preference"}
♿ <b>Mobility:</b> ${mobilityText}
🥗 <b>Dietary:</b> ${data.dietary || "None"}
📝 <b>Notes:</b> ${data.notes || "None"}`;

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

    if (!res.ok) {
      const errText = await res.text();
      console.warn("Telegram notification response error:", errText);
    }
  } catch (err) {
    console.warn("Failed to send Telegram notification:", err.message);
  }
}