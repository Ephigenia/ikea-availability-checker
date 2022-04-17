'use strict';

class IngkaError extends Error {}
class IngkaParseError extends IngkaError{
  constructor(message, data) {
    super(message);
    this.data = data;
  }
}

class IngkaResponseError extends IngkaError {
  /**
   * @param {import('axios').AxiosError} error Axios Error object
   */
  constructor(error) {
    super(error.message);
    Object.assign(this, error);
    this.res = error.request.res;
  }
}

class IngkaNotFoundError extends IngkaResponseError {}

module.exports = {
  IngkaError,
  IngkaNotFoundError,
  IngkaParseError,
  IngkaResponseError,
};
