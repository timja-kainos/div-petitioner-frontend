const { expect } = require('test/util/chai');

const modulePath = 'app/core/DivLogger';
const divLogger = require(modulePath).getLogger(__filename);

describe(modulePath, () => {
  const expectedPrefix = '(uid: ';
  let loggedMessage = '';

  // the following really only needs to be performed once, but as beforeAll is not available, beforeEach has been used
  beforeEach(() => {
    const outputter = divLogger.nodejsLogger;
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

    divLogger.info(message);
    expect(loggedMessage.startsWith(expectedPrefix)).to.eql(true);
    expect(loggedMessage.endsWith(message)).to.eql(true);
  });

  it('adds id to warning logging request', () => {
    const message = 'this is a warning message';

    divLogger.warn(message);
    expect(loggedMessage.startsWith(expectedPrefix)).to.eql(true);
    expect(loggedMessage.endsWith(message)).to.eql(true);
  });

  it('adds id to error logging request', () => {
    const message = 'this is an error message';

    divLogger.error(message);
    expect(loggedMessage.startsWith(expectedPrefix)).to.eql(true);
    expect(loggedMessage.endsWith(message)).to.eql(true);
  });

  it('adds id to fatal logging request', () => {
    const message = 'this is a fatal message';

    divLogger.fatal(message);
    expect(loggedMessage.startsWith(expectedPrefix)).to.eql(true);
    expect(loggedMessage.endsWith(message)).to.eql(true);
  });

  it('adds id to debug logging request', () => {
    const message = 'this is a debug message';

    divLogger.debug(message);
    expect(loggedMessage.startsWith(expectedPrefix)).to.eql(true);
    expect(loggedMessage.endsWith(message)).to.eql(true);
  });

  it('adds id to trace logging request', () => {
    const message = 'this is a trace message';

    divLogger.trace(message);
    expect(loggedMessage.startsWith(expectedPrefix)).to.eql(true);
    expect(loggedMessage.endsWith(message)).to.eql(true);
  });
});
