/**
 * ✅ Recomendado: setea el webhook a Cloudflare Worker
 * y configura secret_token para que Telegram mande el header.
 */
function setWebhookToWorker_() {
  const workerUrl = Env.getWorkerUrl();
  const secret = Env.getTelegramWebhookSecret(); // TG_WEBHOOK_SECRET

  // opcional: drop_pending_updates (para limpiar cola)
  const token = Env.getTelegramToken();
  const url = `https://api.telegram.org/bot${token}/setWebhook`;

  const res = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      url: workerUrl,
      secret_token: secret,
      drop_pending_updates: true,
    }),
    muteHttpExceptions: true,
  });

  Logger.log(res.getContentText());
}

/** Debug */
function getWebhookInfo_() {
  const token = Env.getTelegramToken();
  const url = `https://api.telegram.org/bot${token}/getWebhookInfo`;
  const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  Logger.log(res.getContentText());
}
