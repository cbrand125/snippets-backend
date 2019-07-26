/**
 * Error object containing user friendly message and HTTP status code
 */
class ErrorWithHttpStatus extends Error {
  /**
   * creates a new ErrorWithHttpStatus
   *
   * @param {string} message user-friendly error message that can be displayed on the front end
   * @param {number} status HTTP status code
   */
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

module.exports = ErrorWithHttpStatus;
