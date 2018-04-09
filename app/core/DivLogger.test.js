const { expect } = require('test/util/chai');
const clientId = require('app/services/idam').clientId();

const modulePath = 'app/core/DivLogger';
const divLogger = require(modulePath).getLogger(__filename);

describe(modulePath, () => {
  let loggedMessage = '';

  // the following really only needs to be performed once, but as beforeAll is not available, beforeEach has been used
  beforeEach(() => {
    const outputter = divLogger.logger;
    if (!outputter) return;

    function intercept(method) {
      const original = outputter[method];
      outputter[method] = function redirector(...args) {
        // capture the formatted message in our comparison buffer
        loggedMessage = Array.prototype.slice.apply(args).join(' ');

        if (original.apply) {
          // do this for modern browsers
          original.apply(outputter, args);
        } else {
          // do this for IE
          original(loggedMessage);
        }
      };
    }

    const methods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

    for (let i = 0; i < methods.length; i++) {
      intercept(methods[i]);
    }
  });

  it('adds id to info logging request', () => {
    const message = 'this is an info message';
    const expected = `${clientId}: ${message}`;

    divLogger.info(message);
    expect(loggedMessage.endsWith(expected)).to.eql(true);
  });

  it('adds id to warning logging request', () => {
    const message = 'this is a warning message';
    const expected = `${clientId}: ${message}`;

    divLogger.warn(message);
    expect(loggedMessage.endsWith(expected)).to.eql(true);
  });

  it('adds id to error logging request', () => {
    const message = 'this is an error message';
    const expected = `${clientId}: ${message}`;

    divLogger.error(message);
    expect(loggedMessage.endsWith(expected)).to.eql(true);
  });

  it('adds id to fatal logging request', () => {
    const message = 'this is a fatal message';
    const expected = `${clientId}: ${message}`;

    divLogger.fatal(message);
    expect(loggedMessage.endsWith(expected)).to.eql(true);
  });

  it('adds id to debug logging request', () => {
    const message = 'this is a debug message';
    const expected = `${clientId}: ${message}`;

    divLogger.debug(message);
    expect(loggedMessage.endsWith(expected)).to.eql(true);
  });

  it('adds id to trace logging request', () => {
    const message = 'this is a trace message';
    const expected = `${clientId}: ${message}`;

    divLogger.trace(message);
    expect(loggedMessage.endsWith(expected)).to.eql(true);
  });
});
