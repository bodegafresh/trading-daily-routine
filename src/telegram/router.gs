class TelegramRouter {
  static route(ctx) {
    const { chatId, text } = ctx;
    Log.info("INCOMING", { chatId, text });
    Log.info("ALLOWED", Env.getAllowedChatIds());
    // Authorization gate
    if (!Auth.isAuthorized(chatId)) {
      Log.warn("Unauthorized chatId tried to interact", { chatId, text });
      if (!Env.isUnauthorizedSilent()) {
        TelegramClient.sendMessage(chatId, "⛔️ No autorizado.");
      }
      return ContentService.createTextOutput("IGNORED");
    }

    // Commands
    const t = TextUtils.normalize(text);

    if (TextUtils.isCommand(t, "/start")) {
      return this._reply(
        chatId,
        "🧠 <b>Trading Routine Bot</b>\n\n" +
          "Comandos:\n" +
          "• /trade start\n" +
          "• /trade stop\n" +
          "• /trade status\n" +
          "• /trade cancel"
      );
    }

    if (TextUtils.isCommand(t, "/trade start")) {
      TradeCommands.start(chatId);
      return ContentService.createTextOutput("OK");
    }

    if (TextUtils.isCommand(t, "/trade stop")) {
      TradeCommands.stop(chatId);
      return ContentService.createTextOutput("OK");
    }

    if (TextUtils.isCommand(t, "/trade status")) {
      TradeCommands.status(chatId);
      return ContentService.createTextOutput("OK");
    }

    if (TextUtils.isCommand(t, "/trade cancel")) {
      TradeCommands.cancel(chatId);
      return ContentService.createTextOutput("OK");
    }

    if (TextUtils.isCommand(t, "/trade", true)) {
      return this._reply(
        chatId,
        "Usa:\n• /trade start\n• /trade stop\n• /trade status\n• /trade cancel"
      );
    }

    // If not a command, maybe it is an answer to an ongoing flow
    const session = TradeState.get(chatId);
    if (session && session.flow) {
      TradeFlow.handleAnswer(chatId, t);
      return ContentService.createTextOutput("OK");
    }

    // ignore unknown
    return ContentService.createTextOutput("OK");
  }

  static _reply(chatId, text) {
    TelegramClient.sendMessage(chatId, text);
    return ContentService.createTextOutput("OK");
  }
}
