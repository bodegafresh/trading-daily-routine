class TextUtils {
  static normalize(text) {
    return (text || "").trim();
  }

  static isCommand(text, command) {
    const t = this.normalize(text);
    return t === command || t.startsWith(command + " ");
  }

  static parseIntSafe(text) {
    const n = parseInt(String(text).trim(), 10);
    return Number.isFinite(n) ? n : null;
  }
}
