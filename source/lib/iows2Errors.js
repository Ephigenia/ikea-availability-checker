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
   * @param {import('axios').AxiosError} error error message
   */
  constructor(error) {
    super(error.message);
    Object.assign(this, error);
  }
}

module.exports = {
  IOWS2Error,
  IOWS2ParseError,
  IOWS2ResponseError,
}
