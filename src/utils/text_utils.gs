class TextUtils {
  static normalize(text) {
    return (text || "").trim();
  }

  static isCommand(text, command, exact = false) {
    const t = this.normalize(text);
    if (exact) return t === command || t.startsWith(command + "@"); // por grupos
    return (
      t === command ||
      t.startsWith(command + " ") ||
      t.startsWith(command + "@")
    );
  }

  static parseIntSafe(text) {
    const n = parseInt(String(text).trim(), 10);
    return Number.isFinite(n) ? n : null;
  }
}
