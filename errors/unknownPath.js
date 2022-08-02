class UnknownPathError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnknownPathError';
    this.statusCode = 404;
  }
}

module.exports = UnknownPathError;
