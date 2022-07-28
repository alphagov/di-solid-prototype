class SessionError extends Error {
  constructor(message = "No WebID found in session") {
    super(message);
    this.name = this.constructor.name;
  }
}

export default SessionError;
