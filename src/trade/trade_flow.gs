class TradeFlow {
  static handleAnswer(chatId, answer) {
    const session = TradeState.get(chatId);
    if (!session) return;

    try {
      if (session.flow === "START") {
        this._handleStart(chatId, session, answer);
        return;
      }
      if (session.flow === "STOP") {
        this._handleStop(chatId, session, answer);
        return;
      }
    } catch (err) {
      Log.error("TradeFlow error", { message: err.message, stack: err.stack });
      TelegramClient.sendMessage(
        chatId,
        "⚠️ Ocurrió un error procesando tu respuesta. Intenta de nuevo o usa /trade cancel."
      );
    }
  }

  static _handleStart(chatId, session, answer) {
    const step = session.step;

    if (step === TRADE_STEPS.START_EMOTION) {
      const v = TradeValidation.validateEmotion(answer);
      if (!v.ok)
        return TelegramClient.sendMessage(
          chatId,
          `❌ ${v.error}\nEstado emocional (1–10):`
        );

      session.data.emotionStart = v.value;
      session.step = TRADE_STEPS.START_ENERGY;
      TradeState.set(chatId, session);

      return TelegramClient.sendMessage(
        chatId,
        "2) Nivel de energía (bajo/medio/alto):"
      );
    }

    if (step === TRADE_STEPS.START_ENERGY) {
      const v = TradeValidation.validateEnum(
        answer,
        ["bajo", "medio", "alto"],
        "energía"
      );
      if (!v.ok)
        return TelegramClient.sendMessage(
          chatId,
          `❌ ${v.error}\nNivel de energía (bajo/medio/alto):`
        );

      session.data.energy = v.value;
      session.step = TRADE_STEPS.START_SLEEP;
      TradeState.set(chatId, session);

      return TelegramClient.sendMessage(
        chatId,
        "3) Calidad de sueño (bajo/medio/alto):"
      );
    }

    if (step === TRADE_STEPS.START_SLEEP) {
      const v = TradeValidation.validateEnum(
        answer,
        ["bajo", "medio", "alto"],
        "sueño"
      );
      if (!v.ok)
        return TelegramClient.sendMessage(
          chatId,
          `❌ ${v.error}\nCalidad de sueño (bajo/medio/alto):`
        );

      session.data.sleepQuality = v.value;

      // compute blocked
      const blocked =
        session.data.emotionStart <= TRADE.EMOTION_BLOCK_THRESHOLD;
      session.data.blockedNoTrade = blocked;

      // Persist start row now
      const tz = Session.getScriptTimeZone();
      const startData = {
        sessionId: session.sessionId,
        date: DateUtils.todayYmd(tz),
        startTime: DateUtils.timeHm(tz),
        emotionStart: session.data.emotionStart,
        energy: session.data.energy,
        sleepQuality: session.data.sleepQuality,
        blockedNoTrade: blocked,
        createdAtIso: DateUtils.nowIso(),
        updatedAtIso: DateUtils.nowIso(),
      };
      SheetRepository.appendStartRow(startData);

      // Mark start done but keep session for later stop
      session.step = TRADE_STEPS.START_DONE;
      session.flow = "START";
      TradeState.set(chatId, session);

      const msg =
        "✅ <b>Inicio registrado</b>\n\n" +
        "Recuerda leer:\n" +
        "• Identidad del trader\n" +
        "• Reglas mentales clave\n\n" +
        (blocked
          ? "⛔️ <b>NO OPERAR</b> (estado emocional ≤ 3)\n\nPuedes igual cerrar con /trade stop si corresponde."
          : "🟢 Sesión habilitada.\n\nCuando termines: /trade stop");

      TelegramClient.sendMessage(chatId, TradeRules.summary());

      return TelegramClient.sendMessage(chatId, msg);
    }

    if (step === TRADE_STEPS.START_DONE) {
      // If user keeps answering, guide them
      return TelegramClient.sendMessage(
        chatId,
        "Inicio ya registrado. Usa /trade stop al finalizar o /trade status."
      );
    }
  }

  static _handleStop(chatId, session, answer) {
    const step = session.step;

    if (step === TRADE_STEPS.STOP_RULES) {
      const v = TradeValidation.validateYesNo(answer);
      if (!v.ok)
        return TelegramClient.sendMessage(
          chatId,
          `❌ ${v.error}\n¿Cumplimiento de reglas? (si/no):`
        );

      session.data.rulesCompliance = v.value;
      session.step = TRADE_STEPS.STOP_DOMINANT_EMOTION;
      TradeState.set(chatId, session);

      return TelegramClient.sendMessage(
        chatId,
        "2) Emoción dominante (texto breve):"
      );
    }

    if (step === TRADE_STEPS.STOP_DOMINANT_EMOTION) {
      const txt = TextUtils.normalize(answer);
      if (!txt)
        return TelegramClient.sendMessage(
          chatId,
          "❌ Ingresa una emoción dominante (texto breve):"
        );

      session.data.dominantEmotion = txt;
      session.step = TRADE_STEPS.STOP_WINS;
      TradeState.set(chatId, session);

      return TelegramClient.sendMessage(
        chatId,
        "3) Operaciones ganadas (número >= 0):"
      );
    }

    if (step === TRADE_STEPS.STOP_WINS) {
      const v = TradeValidation.validateNonNegativeInt(answer, "ganadas");
      if (!v.ok)
        return TelegramClient.sendMessage(
          chatId,
          `❌ ${v.error}\nOperaciones ganadas (>=0):`
        );

      session.data.wins = v.value;
      session.step = TRADE_STEPS.STOP_LOSSES;
      TradeState.set(chatId, session);

      return TelegramClient.sendMessage(
        chatId,
        "4) Operaciones perdidas (número >= 0):"
      );
    }

    if (step === TRADE_STEPS.STOP_LOSSES) {
      const v = TradeValidation.validateNonNegativeInt(answer, "perdidas");
      if (!v.ok)
        return TelegramClient.sendMessage(
          chatId,
          `❌ ${v.error}\nOperaciones perdidas (>=0):`
        );

      session.data.losses = v.value;
      session.step = TRADE_STEPS.STOP_BREAKEVENS;
      TradeState.set(chatId, session);

      return TelegramClient.sendMessage(
        chatId,
        "5) Operaciones empatadas (número >= 0):"
      );
    }

    if (step === TRADE_STEPS.STOP_BREAKEVENS) {
      const v = TradeValidation.validateNonNegativeInt(answer, "empatadas");
      if (!v.ok)
        return TelegramClient.sendMessage(
          chatId,
          `❌ ${v.error}\nOperaciones empatadas (>=0):`
        );

      session.data.breakevens = v.value;
      session.step = TRADE_STEPS.STOP_NOTES;
      TradeState.set(chatId, session);

      return TelegramClient.sendMessage(
        chatId,
        "6) Observaciones breves (puede ser vacío con '-'):"
      ); // allow "-"
    }

    if (step === TRADE_STEPS.STOP_NOTES) {
      const notes = TextUtils.normalize(answer);
      session.data.notes = notes === "-" ? "" : notes;

      // Persist stop update
      const tz = Session.getScriptTimeZone();
      const stopData = {
        endTime: DateUtils.timeHm(tz),
        rulesCompliance: session.data.rulesCompliance || "",
        dominantEmotion: session.data.dominantEmotion || "",
        wins: session.data.wins != null ? session.data.wins : "",
        losses: session.data.losses != null ? session.data.losses : "",
        breakevens:
          session.data.breakevens != null ? session.data.breakevens : "",
        notes: session.data.notes || "",
        updatedAtIso: DateUtils.nowIso(),
      };

      SheetRepository.updateStopFields(session.sessionId, stopData);

      TradeState.clear(chatId);

      return TelegramClient.sendMessage(
        chatId,
        "🏁 <b>Sesión cerrada y registrada</b>\n\n" +
          "El día termina cuando tú decides, no cuando el mercado lo hace."
      );
    }

    return TelegramClient.sendMessage(
      chatId,
      "⚠️ Paso no reconocido. Usa /trade status o /trade cancel."
    );
  }
}
