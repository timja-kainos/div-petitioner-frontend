const logger = require('@hmcts/nodejs-logging').getLogger(__filename);
const clientId = require('app/services/idam').clientId;

class DivLogger {
  // **
  // * Public functions
  // **

  info(message) {
    logger.info(this._getMessagePrefix() + message);
  }

  warn(message) {
    logger.warn(this._getMessagePrefix() + message);
  }

  error(message) {
    logger.error(this._getMessagePrefix() + message);
  }

  fatal(message) {
    logger.trace(this._getMessagePrefix() + message);
  }

  trace(message) {
    logger.trace(this._getMessagePrefix() + message);
  }

  debug(message) {
    logger.debug(this._getMessagePrefix() + message);
  }

  // **
  // * Private functions
  // **

  _getMessagePrefix() {
    return `(uid: ${clientId}) `;
  }
}

module.exports = DivLogger;
