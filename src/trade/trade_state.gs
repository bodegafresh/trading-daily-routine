class TradeState {
  /**
   * session object shape (suggested):
   * {
   *   flow: "START" | "STOP",
   *   step: "...",
   *   sessionId: "...",
   *   data: { ... }
   * }
   */
  static get(chatId) {
    return PropertiesStore.get(chatId);
  }

  static set(chatId, session) {
    PropertiesStore.set(chatId, session);
  }

  static clear(chatId) {
    PropertiesStore.clear(chatId);
  }
}
