class PropertiesStore {
  static _key(chatId) {
    return `trade_session_${String(chatId)}`;
  }

  static get(chatId) {
    const raw = PropertiesService.getScriptProperties().getProperty(
      this._key(chatId)
    );
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  static set(chatId, obj) {
    PropertiesService.getScriptProperties().setProperty(
      this._key(chatId),
      JSON.stringify(obj)
    );
  }

  static clear(chatId) {
    PropertiesService.getScriptProperties().deleteProperty(this._key(chatId));
  }
}
