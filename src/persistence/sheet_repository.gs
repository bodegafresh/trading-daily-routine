class SheetRepository {
  static _sheet() {
    const ss = SpreadsheetApp.openById(Env.getSpreadsheetId());
    const name = Env.getSheetName();
    let sh = ss.getSheetByName(name);
    if (!sh) {
      sh = ss.insertSheet(name);
      this._initHeader(sh);
    }
    return sh;
  }

  static _initHeader(sh) {
    const header = [
      "session_id",
      "date",
      "start_time",
      "end_time",
      "emotion_start",
      "energy",
      "sleep_quality",
      "blocked_no_trade",
      "rules_compliance",
      "dominant_emotion",
      "wins",
      "losses",
      "breakevens",
      "notes",
      "created_at_iso",
      "updated_at_iso",
    ];
    sh.getRange(1, 1, 1, header.length).setValues([header]);
  }

  static appendStartRow(startData) {
    const sh = this._sheet();
    const row = [
      startData.sessionId,
      startData.date,
      startData.startTime,
      "", // end_time
      startData.emotionStart,
      startData.energy,
      startData.sleepQuality,
      startData.blockedNoTrade ? "true" : "false",
      "", // rules_compliance
      "", // dominant_emotion
      "", // wins
      "", // losses
      "", // breakevens
      "", // notes
      startData.createdAtIso,
      startData.updatedAtIso,
    ];
    sh.appendRow(row);
  }

  static updateStopFields(sessionId, stopData) {
    const sh = this._sheet();
    const lastRow = sh.getLastRow();
    if (lastRow < 2) throw new Error("Sheet empty");

    // Find row by session_id in col A
    const values = sh.getRange(2, 1, lastRow - 1, 1).getValues(); // session_id column
    let rowIndex = -1;
    for (let i = 0; i < values.length; i++) {
      if (String(values[i][0]) === String(sessionId)) {
        rowIndex = i + 2; // actual sheet row
        break;
      }
    }
    if (rowIndex === -1)
      throw new Error(`Session not found in sheet: ${sessionId}`);

    // Map to columns:
    // D end_time, I rules_compliance, J dominant_emotion, K wins, L losses, M breakevens, N notes, P updated_at_iso
    sh.getRange(rowIndex, 4).setValue(stopData.endTime);
    sh.getRange(rowIndex, 9).setValue(stopData.rulesCompliance);
    sh.getRange(rowIndex, 10).setValue(stopData.dominantEmotion);
    sh.getRange(rowIndex, 11).setValue(stopData.wins);
    sh.getRange(rowIndex, 12).setValue(stopData.losses);
    sh.getRange(rowIndex, 13).setValue(stopData.breakevens);
    sh.getRange(rowIndex, 14).setValue(stopData.notes);
    sh.getRange(rowIndex, 16).setValue(stopData.updatedAtIso);
  }
}
