const ErrorWithHttpStatus = require('../utils/ErrorWithHttpStatus');

const errorHandler = (err, request, response, next) => {
  if (err instanceof ErrorWithHttpStatus) {
    return response.status(err.status).send(err.message);
  }
  return response.status(500).send('Server Error');
};

module.exports = errorHandler;
