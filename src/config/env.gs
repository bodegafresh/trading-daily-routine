/**
 * Reads configuration from Script Properties.
 * Set these in Apps Script: Project Settings -> Script Properties.
 */
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

  static getSpreadsheetId() {
    return this._required("SPREADSHEET_ID");
  }

  static getSheetName() {
    return (
      PropertiesService.getScriptProperties().getProperty("SHEET_NAME") ||
      DEFAULTS.SHEET_NAME
    );
  }

  // ✅ NUEVO: Worker URL (webhook real)
  static getWorkerUrl() {
    return this._required("WORKER_URL").replace(/\/+$/, "");
  }

  // ✅ NUEVO: secret que Telegram enviará al Worker como header
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
