class TelegramClient {
  static sendMessage(chatId, text, extra) {
    const token = Env.getTelegramToken();
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const payload = Object.assign(
      {
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      },
      extra || {}
    );

    const res = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    });

    const code = res.getResponseCode();
    if (code >= 400) {
      Log.error("Telegram sendMessage failed", {
        code,
        body: res.getContentText(),
      });
    }
    return res;
  }

  static setWebhook(webhookUrl, secretToken) {
    const token = Env.getTelegramToken();
    const url = `https://api.telegram.org/bot${token}/setWebhook`;

    const payload = { url: webhookUrl };
    if (secretToken) payload.secret_token = secretToken;

    const res = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    });

    Log.info("setWebhook response", {
      code: res.getResponseCode(),
      body: res.getContentText(),
    });
    return res;
  }
}
