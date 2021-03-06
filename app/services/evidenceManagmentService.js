const CONF = require('config');
const superagent = require('superagent');
const httpStatus = require('http-status-codes');
const logger = require('@hmcts/nodejs-logging').getLogger(__filename);
const errors = require('app/resources/errors');
const fileManagment = require('app/services/fileManagement');

const evidenceManagmentClientUploadUrl = `${CONF.evidenceManagmentClient.url}${CONF.evidenceManagmentClient.uploadEndpoint}`;
const defaultEMCErrorMessage = 'Error uploading to evidence management client';

const mockFileResponse = (file = { name: 'image.jpg' }) => {
  return [
    {
      fileName: file.name,
      fileUrl: file.path,
      status: 'OK'
    }
  ];
};

const handleResponse = (body, resolve, reject) => {
  if (body.error && body.error.length) {
    logger.error(`Error when uploading to Evidence Management: ${JSON.stringify(body)}`);
    return reject(body);
  }

  const dataIsNotValid = !Array.isArray(body) || !body[0].status || body[0].status !== 'OK';
  if (dataIsNotValid) {
    logger.error(`Error when uploading to Evidence Management: ${JSON.stringify(body)}`);
    return reject();
  }

  logger.info(`Uploaded files to Evidence Management Client, response: ${JSON.stringify(body)}`);

  return resolve(body);
};

const sendFile = (file, options = { token: 'token' }) => {
  return new Promise((resolve, reject) => {
    // return mock if no client API available
    if (!process.env.EVIDENCE_MANAGEMENT_CLIENT_API_URL) {
      return handleResponse(mockFileResponse(file), resolve, reject);
    }
    return superagent
      .post(evidenceManagmentClientUploadUrl)
      .set({ AuthorizationToken: options.token })
      .set('enctype', 'multipart/form-data')
      .attach('file', file.path, file.name)
      .end((error, response = { statusCode: null }) => {
        fileManagment.removeFile(file);
        if (error || response.statusCode !== httpStatus.OK) {
          const errorToReturn = new Error(error || response.body || defaultEMCErrorMessage);
          errorToReturn.status = response.statusCode;

          logger.error(`Error when uploading to Evidence Management: ${JSON.stringify(errorToReturn)}`);

          if (response && response.errorCode === 'invalidFileType') {
            return reject(errors.fileTypeInvalid);
          }
          return reject(errorToReturn);
        }
        return handleResponse(response.body, resolve, reject);
      });
  });
};

module.exports = {
  sendFile,
  handleResponse,
  mockFileResponse
};
