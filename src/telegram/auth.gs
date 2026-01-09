class Auth {
  static isAuthorized(chatId) {
    const allowed = Env.getAllowedChatIds();
    return allowed.includes(String(chatId));
  }
}
