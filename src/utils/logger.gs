class Log {
  static info(message, obj) {
    if (obj !== undefined) {
      console.log(`[INFO] ${message}`, JSON.stringify(obj));
    } else {
      console.log(`[INFO] ${message}`);
    }
  }

  static warn(message, obj) {
    if (obj !== undefined) {
      console.warn(`[WARN] ${message}`, JSON.stringify(obj));
    } else {
      console.warn(`[WARN] ${message}`);
    }
  }

  static error(message, obj) {
    if (obj !== undefined) {
      console.error(`[ERROR] ${message}`, JSON.stringify(obj));
    } else {
      console.error(`[ERROR] ${message}`);
    }
  }
}
