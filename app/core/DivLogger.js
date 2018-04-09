const NodejsLogger = require('@hmcts/nodejs-logging');
const clientId = require('app/services/idam').clientId();

class DivLogger {
  // **
  // * Public functions
  // **

  constructor(filename) {
    this.nodejsLogger = NodejsLogger.getLogger(filename);
  }

  info(message) {
    this.nodejsLogger.info(`${this._getMessagePrefix()} ${message}`);
  }

  warn(message) {
    this.nodejsLogger.warn(`${this._getMessagePrefix()} ${message}`);
  }

  error(message) {
    this.nodejsLogger.error(`${this._getMessagePrefix()} ${message}`);
  }

  fatal(message) {
    this.nodejsLogger.trace(`${this._getMessagePrefix()} ${message}`);
  }

  trace(message) {
    this.nodejsLogger.trace(`${this._getMessagePrefix()} ${message}`);
  }

  debug(message) {
    this.nodejsLogger.debug(`${this._getMessagePrefix()} ${message}`);
  }

  // **
  // * Public static functions
  // **

  static getLogger(name) {
    return new DivLogger(name);
  }

  static config(config) {
    NodejsLogger.config(config);
  }

  // **
  // * Private functions
  // **

  _getMessagePrefix() {
    return `(uid: ${clientId})`;
  }
}

module.exports = DivLogger;
