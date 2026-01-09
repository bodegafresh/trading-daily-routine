class TelegramWebhook {
  static handle(e) {
    try {
      if (!e || !e.postData || !e.postData.contents) {
        return this._ok("NO_BODY");
      }

      const update = JSON.parse(e.postData.contents);
      const msg = update.message || update.edited_message || null;
      if (!msg) return this._ok("NO_MESSAGE");

      const chatId = String(msg.chat && msg.chat.id);
      const text = msg.text != null ? String(msg.text) : "";
      const from = msg.from || {};

      return TelegramRouter.route({ update, chatId, text, from });
    } catch (err) {
      Log.error("Webhook handle error", {
        message: err.message,
        stack: err.stack,
      });
      return this._ok("ERROR"); // siempre 200
    }
  }

  static _ok(text) {
    return ContentService.createTextOutput(text).setMimeType(
      ContentService.MimeType.TEXT
    );
  }
}
