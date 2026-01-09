class DateUtils {
  static nowIso() {
    return new Date().toISOString();
  }

  static todayYmd(tz) {
    const d = new Date();
    return Utilities.formatDate(
      d,
      tz || Session.getScriptTimeZone(),
      "yyyy-MM-dd"
    );
  }

  static timeHm(tz) {
    const d = new Date();
    return Utilities.formatDate(d, tz || Session.getScriptTimeZone(), "HH:mm");
  }
}
