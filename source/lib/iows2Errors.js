'use strict';

class IOWS2Error extends Error {}
class IOWS2ParseError extends IOWS2Error{
  constructor(message, data) {
    super(message);
    this.data = data;
  }
}

class IOWS2ResponseError extends IOWS2Error {
  /**
   * @param {import('axios').AxiosError} error Axios Error object
   */
  constructor(error) {
    super(error.message);
    Object.assign(this, error);
  }
}

class IOWS2DeprecatedError extends IOWS2ResponseError {}
class IOWS2NotFoundError extends IOWS2ResponseError {}

module.exports = {
  IOWS2DeprecatedError,
  IOWS2Error,
  IOWS2NotFoundError,
  IOWS2ParseError,
  IOWS2ResponseError,
};
