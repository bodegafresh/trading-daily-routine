class TradeValidation {
  static validateEmotion(value) {
    const n = TextUtils.parseIntSafe(value);
    if (n === null || n < 1 || n > 10)
      return { ok: false, error: "Ingresa un número del 1 al 10." };
    return { ok: true, value: n };
  }

  static validateEnum(value, allowed, label) {
    const v = String(value || "").toLowerCase();
    if (!allowed.includes(v)) {
      return {
        ok: false,
        error: `Respuesta inválida. Usa: ${allowed.join(" / ")}.`,
      };
    }
    return { ok: true, value: v };
  }

  static validateYesNo(value) {
    const v = String(value || "").toLowerCase();
    if (["si", "sí", "s"].includes(v)) return { ok: true, value: "si" };
    if (["no", "n"].includes(v)) return { ok: true, value: "no" };
    return { ok: false, error: "Responde: si / no." };
  }

  static validateNonNegativeInt(value, label) {
    const n = TextUtils.parseIntSafe(value);
    if (n === null || n < 0)
      return {
        ok: false,
        error: `Ingresa un número entero >= 0 para ${label}.`,
      };
    return { ok: true, value: n };
  }
}
