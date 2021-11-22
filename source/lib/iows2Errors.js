export class IOWS2Error extends Error {}
export class IOWS2ParseError extends IOWS2Error{
  constructor(message, data) {
    super(message);
    this.data = data;
  }
}

export class IOWS2ResponseError extends IOWS2Error {
  /**
   * @param {import('axios').AxiosError} error error message
   */
  constructor(error) {
    super(error.message);
    Object.assign(this, error);
  }
}
