const DestroySessionStep = require('app/core/DestroySessionStep');
const runStepHandler = require('app/core/handler/runStepHandler');

module.exports = class ExitNoCertificateTranslated extends DestroySessionStep {
  handler(req, res) {
    res.clearCookie('connect.sid');
    return runStepHandler(this, req, res);
  }
  get url() {
    return '/exit/about-your-marriage/no-certificate-translated';
  }
};
