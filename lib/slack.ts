// Slack notification helper. Supports either:
//   1. SLACK_WEBHOOK_URL                       (incoming webhook, channel is baked in)
//   2. SLACK_BOT_TOKEN + SLACK_CHANNEL_ID      (existing bot app via chat.postMessage)
// If both are set, the webhook wins. Best-effort: never throws.

export async function notifySlack(text: string): Promise<void> {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  const botToken = process.env.SLACK_BOT_TOKEN;
  const channel = process.env.SLACK_CHANNEL_ID;

  try {
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error(`[slack] webhook failed: ${res.status} ${body}`);
      }
      return;
    }
    if (botToken && channel) {
      const res = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${botToken}`,
        },
        body: JSON.stringify({ channel, text }),
      });
      const data = await res.json();
      if (!data.ok) console.error("[slack] chat.postMessage failed:", data.error);
      return;
    }
    console.warn("[slack] no Slack credentials configured - notification skipped");
  } catch (err) {
    console.error("[slack] notify failed:", err);
  }
}
