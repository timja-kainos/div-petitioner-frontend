const ValidationStep = require('app/core/ValidationStep');
const { runStepHandler } = require('app/core/handler/runStepHandler');
const { watch } = require('app/core/staleDataManager');

module.exports = class PetitionerChangedNamed extends ValidationStep {
  get url() {
    return '/petitioner-respondent/changed-name';
  }
  get nextStep() {
    return this.steps.PetitionerContactDetails;
  }

  constructor(...args) {
    super(...args);

    watch('petitionerNameDifferentToMarriageCertificate', (previousSession, session, remove) => {
      if (session.petitionerNameDifferentToMarriageCertificate === 'No') {
        remove('petitionerNameChangedHow', 'petitionerNameChangedHowOtherDetails');
      }
    });

    watch('petitionerNameChangedHow', (previousSession, session, remove) => {
      if (session.petitionerNameChangedHow && session.petitionerNameChangedHow.indexOf('other') === -1) {
        remove('petitionerNameChangedHowOtherDetails');
      }
    });
  }

  * validate(ctx, session) {
    let [isValid, errors] = yield super.validate(ctx, session); // eslint-disable-line prefer-const

    const removePetitionerNameAsOnMarriageCertificateError = error => {
      return error.param === 'petitionerNameDifferentToMarriageCertificate';
    };
    const showPetitionerNameAsOnMarriageCertificateErrorOnly = error => {
      return error.param !== 'petitionerNameDifferentToMarriageCertificate';
    };

    if (!isValid) {
      if (ctx.petitionerNameDifferentToMarriageCertificate) {
        errors = errors.filter(
          showPetitionerNameAsOnMarriageCertificateErrorOnly
        );
      } else {
        errors = errors.filter(
          removePetitionerNameAsOnMarriageCertificateError
        );
      }
    }

    return [isValid, errors];
  }

  handler(req, res) {
    return runStepHandler(this, req, res);
  }
};
