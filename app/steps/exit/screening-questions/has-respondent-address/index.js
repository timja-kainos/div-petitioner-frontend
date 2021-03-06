const DestroySessionStep = require('app/core/DestroySessionStep');
const runStepHandler = require('app/core/handler/runStepHandler');

module.exports = class ExitRespondentAddress extends DestroySessionStep {
  handler(req, res) {
    res.clearCookie('connect.sid');
    return runStepHandler(this, req, res);
  }
  get url() {
    return '/exit/screening-questions/respondent-address';
  }
};
