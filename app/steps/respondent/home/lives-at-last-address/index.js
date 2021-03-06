const OptionStep = require('app/core/OptionStep');
const runStepHandler = require('app/core/handler/runStepHandler');
const { watch } = require('app/core/staleDataManager');

module.exports = class RespondentLivesAtLastAddress extends OptionStep {
  get url() {
    return '/petitioner-respondent/lives-at-this-address';
  }
  get nextStep() {
    return {
      respondentLivesAtLastAddress: {
        Yes: this.steps.RespondentCorrespondenceUseHomeAddress,
        No: this.steps.RespondentHomeAddress,
        Unknown: this.steps.RespondentCorrespondenceSendToSolicitor
      }
    };
  }

  constructor(steps, section, templatePath, content, schema) {
    super(steps, section, templatePath, content, schema);

    watch('livingArrangementsLastLivedTogetherAddress', (previousSession, session, remove) => {
      remove('respondentLivesAtLastAddress');
    });
  }

  handler(req, res) {
    return runStepHandler(this, req, res);
  }

  action(ctx, session) {
    if (ctx.respondentLivesAtLastAddress === 'Yes') {
      ctx.livingArrangementsLastLivedTogetherAddress = session.livingArrangementsLastLivedTogetherAddress; // eslint-disable-line max-len
      // if the respondent lives here then this is their home address
      session.respondentHomeAddress = session.livingArrangementsLastLivedTogetherAddress; // eslint-disable-line max-len
    }

    return [ctx, session];
  }

  checkYourAnswersInterceptor(ctx, session) {
    ctx.livingArrangementsLastLivedTogetherAddress = session.livingArrangementsLastLivedTogetherAddress; // eslint-disable-line max-len
    return ctx;
  }
};
