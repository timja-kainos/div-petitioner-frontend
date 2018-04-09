const IdamService = require('app/services/idam');
const NodejsLogger = require('@hmcts/nodejs-logging');

class DivLogger {
  // **
  // * Public static functions
  // **

  static getLogger(name) {
    const logger = NodejsLogger.getLogger(name);

    logger._oldWrap = logger._wrap;
    logger._wrap = function _wrap(message) {
      const logEntry = this._oldWrap(message);

      logEntry.uid = IdamService.clientId() || 'unknown';
      logEntry.message = `${logEntry.uid}: ${logEntry.message}`;

      return logEntry;
    };

    return logger;
  }
}

module.exports = DivLogger;
