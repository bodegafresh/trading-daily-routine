/**
 * Entry point for Telegram Webhook.
 * Deploy as Web App and set Telegram webhook to the deployment URL.
 */
function doPost(e) {
  return TelegramWebhook.handle(e);
}

/**
 * Simple health check (optional).
 * You can visit the Web App URL with GET to confirm it’s alive.
 */
function doGet() {
  return ContentService.createTextOutput("OK").setMimeType(
    ContentService.MimeType.TEXT
  );
}
