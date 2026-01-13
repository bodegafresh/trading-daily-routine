class Env {
  static getTelegramToken() {
    return this._required("TELEGRAM_BOT_TOKEN");
  }

  static getOwnerChatId() {
    return String(this._required("OWNER_CHAT_ID"));
  }

  static getAllowedChatIds() {
    const raw =
      PropertiesService.getScriptProperties().getProperty("ALLOWED_CHAT_IDS");
    if (!raw || !raw.trim()) return [this.getOwnerChatId()];
    return raw
      .split(",")
      .map((s) => String(s.trim()))
      .filter(Boolean);
  }

  // 🔻 YA NO usar Sheets en este flujo (puedes dejarlo por compatibilidad)
  static getSpreadsheetId() {
    return this._required("SPREADSHEET_ID");
  }

  static getSheetName() {
    return (
      PropertiesService.getScriptProperties().getProperty("SHEET_NAME") ||
      DEFAULTS.SHEET_NAME
    );
  }

  // ✅ NUEVO: Supabase
  static getSupabaseUrl() {
    return this._required("SUPABASE_URL").replace(/\/+$/, "");
  }

  static getSupabaseKey() {
    // Recomendación: usa SERVICE_ROLE en Apps Script (es server-side),
    // o anon_key si vas a usar RLS con policies muy bien hechas.
    return this._required("SUPABASE_KEY");
  }

  static getWorkerUrl() {
    return this._required("WORKER_URL").replace(/\/+$/, "");
  }

  static getTelegramWebhookSecret() {
    return this._required("TG_WEBHOOK_SECRET");
  }

  static isUnauthorizedSilent() {
    const v = PropertiesService.getScriptProperties().getProperty(
      "UNAUTHORIZED_SILENT"
    );
    return v === null || v === "" ? true : String(v).toLowerCase() === "true";
  }

  static _required(key) {
    const v = PropertiesService.getScriptProperties().getProperty(key);
    if (!v) throw new Error(`Missing Script Property: ${key}`);
    return v;
  }
}
