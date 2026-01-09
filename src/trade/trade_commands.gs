class TradeCommands {
  static start(chatId) {
    const existing = TradeState.get(chatId);
    if (existing && existing.flow) {
      TelegramClient.sendMessage(
        chatId,
        "⚠️ Ya hay un flujo activo. Usa /trade cancel o /trade status."
      );
      return;
    }

    const sessionId = this._newSessionId();
    const session = {
      flow: "START",
      step: TRADE_STEPS.START_EMOTION,
      sessionId,
      data: {},
    };
    TradeState.set(chatId, session);

    TelegramClient.sendMessage(
      chatId,
      "🟢 <b>Inicio del día (antes de abrir plataforma)</b>\n\n" +
        "1) Estado emocional (1–10):"
    );
  }

  static stop(chatId) {
    const session = TradeState.get(chatId);
    if (!session || !session.sessionId) {
      TelegramClient.sendMessage(
        chatId,
        "⚠️ No hay sesión activa. Inicia con /trade start."
      );
      return;
    }

    // If currently in START flow but completed start already, allow STOP flow
    // If currently in START steps, user should finish or cancel.
    if (session.flow === "START" && session.step !== TRADE_STEPS.START_DONE) {
      TelegramClient.sendMessage(
        chatId,
        "⚠️ Aún no terminas el inicio. Responde las preguntas o usa /trade cancel."
      );
      return;
    }

    const stopSession = {
      flow: "STOP",
      step: TRADE_STEPS.STOP_RULES,
      sessionId: session.sessionId,
      data: session.data || {},
    };
    TradeState.set(chatId, stopSession);

    TelegramClient.sendMessage(
      chatId,
      "🔴 <b>Cierre de sesión</b>\n\n" + "1) ¿Cumplimiento de reglas? (si/no):"
    );
  }

  static status(chatId) {
    const session = TradeState.get(chatId);
    if (!session) {
      TelegramClient.sendMessage(
        chatId,
        "📭 Sin flujo activo. Usa /trade start."
      );
      return;
    }
    TelegramClient.sendMessage(
      chatId,
      "📌 <b>Status</b>\n" +
        `• flow: <code>${session.flow}</code>\n` +
        `• step: <code>${session.step}</code>\n` +
        `• sessionId: <code>${session.sessionId}</code>`
    );
  }

  static cancel(chatId) {
    TradeState.clear(chatId);
    TelegramClient.sendMessage(
      chatId,
      "🧹 Flujo cancelado. Puedes iniciar de nuevo con /trade start."
    );
  }

  static _newSessionId() {
    // Simple unique id
    const rnd = Math.floor(Math.random() * 1e9);
    return `${Date.now()}_${rnd}`;
  }
}
