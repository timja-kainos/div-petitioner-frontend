/* eslint-disable max-nested-callbacks */
const { expect, sinon } = require('test/util/chai');
const featureTogglesMock = require('test/mocks/featureToggles');
const mockedClient = require('app/services/mocks/transformationServiceClient');
const server = require('app');

const modulePath = 'app/middleware/draftPetitionStoreMiddleware';

const draftPetitionStoreMiddleware = require(modulePath);

let s = {};
let req = {};
let res = {};
let next = {};
let checkYourAnswersUrl = '';

describe(modulePath, () => {
  before(() => {
    s = server.init();
    checkYourAnswersUrl = s.steps.CheckYourAnswers.url;
  });

  after(() => {
    s.http.close();
  });

  beforeEach(() => {
    featureTogglesMock.stub();
  });

  afterEach(() => {
    featureTogglesMock.restore();
  });

  describe('#redirectToCheckYourAnswers', () => {
    beforeEach(() => {
      res = { redirect: sinon.stub() };
      next = sinon.stub();
    });
    it('redirects to check your answers if current page is not check your answers', () => {
      req = { originalUrl: '/not-cya' };
      draftPetitionStoreMiddleware.redirectToCheckYourAnswers(req, res, next);
      expect(next.called).to.eql(false);
      expect(res.redirect.calledOnce).to.eql(true);
      expect(res.redirect.calledWith(checkYourAnswersUrl)).to.eql(true);
    });
    it('runs `next()` if page is already check your answers', () => {
      req = { originalUrl: checkYourAnswersUrl };
      draftPetitionStoreMiddleware.redirectToCheckYourAnswers(req, res, next);
      expect(next.calledOnce).to.eql(true);
      expect(res.redirect.called).to.eql(false);
    });
  });

  describe('#restoreFromDraftStore', () => {
    beforeEach(() => {
      res = { redirect: sinon.stub() };
      req = {
        cookies: { '__auth-token': 'auth.token' },
        session: {}
      };
      next = sinon.stub();
      sinon.stub(mockedClient, 'restoreFromDraftStore');
    });

    afterEach(() => {
      mockedClient.restoreFromDraftStore.restore();
    });

    context('session restored', () => {
      it('redirect to check your answers page with new session', done => {
        mockedClient.restoreFromDraftStore.resolves(mockedClient.mockSession);
        const test = cleanUp => {
          draftPetitionStoreMiddleware.restoreFromDraftStore(req, res, next);
          // wait for promise to resolve
          setTimeout(() => {
            expect(mockedClient.restoreFromDraftStore.called).to.equal(true);
            expect(res.redirect.calledOnce).to.eql(true);
            expect(res.redirect.calledWith(checkYourAnswersUrl)).to.eql(true);
            expect(req.session).to.eql(mockedClient.mockSession);
            cleanUp();
          }, 1);
        };
        const featureMock = featureTogglesMock.when('idam', true, test);
        featureMock(done);
      });
      it('does not attempt to restore if we have already fetched from Draft store', done => {
        req.session = { screenHasMarriageBroken: true, fetchedDraft: true };
        const test = cleanUp => {
          draftPetitionStoreMiddleware.restoreFromDraftStore(req, res, next);
          // wait for promise to resolve
          setTimeout(() => {
            expect(mockedClient.restoreFromDraftStore.called).to.equal(false);
            expect(next.calledOnce).to.eql(true);
            cleanUp();
          }, 1);
        };
        const featureMock = featureTogglesMock.when('idam', true, test);
        featureMock(done);
      });
      it('does not attempt to restore session if no auth token populated', done => {
        req.cookies = {};
        const test = cleanUp => {
          draftPetitionStoreMiddleware.restoreFromDraftStore(req, res, next);
          // wait for promise to resolve
          setTimeout(() => {
            expect(mockedClient.restoreFromDraftStore.called).to.equal(false);
            expect(next.calledOnce).to.eql(true);
            cleanUp();
          }, 1);
        };
        const featureMock = featureTogglesMock.when('idam', true, test);
        featureMock(done);
      });
    });

    it('restores session if mockRestoreSession cookie set', done => {
      req.cookies = { mockRestoreSession: 'true' };
      mockedClient.restoreFromDraftStore.resolves(mockedClient.mockSession);

      draftPetitionStoreMiddleware.restoreFromDraftStore(req, res, next);
      // wait for promise to resolve
      setTimeout(() => {
        expect(mockedClient.restoreFromDraftStore.called).to.equal(true);
        expect(res.redirect.calledOnce).to.eql(true);
        expect(res.redirect.calledWith(checkYourAnswersUrl)).to.eql(true);
        expect(req.session).to.eql(mockedClient.mockSession);
        done();
      }, 1);
    });
  });
});