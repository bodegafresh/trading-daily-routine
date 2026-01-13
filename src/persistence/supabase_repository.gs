class SupabaseClient {
  static request(path, method, body) {
    const url = `${Env.getSupabaseUrl()}/rest/v1/${path}`;
    const key = Env.getSupabaseKey();

    const params = {
      method,
      muteHttpExceptions: true,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    };

    if (body !== undefined && body !== null) {
      params.payload = JSON.stringify(body);
    }

    const res = UrlFetchApp.fetch(url, params);
    const code = res.getResponseCode();
    const text = res.getContentText();

    if (code >= 200 && code < 300) {
      return text ? JSON.parse(text) : null;
    }

    throw new Error(`Supabase error ${code}: ${text}`);
  }
}
