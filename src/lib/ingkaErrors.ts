import { AxiosError, AxiosResponse } from "axios";

export class IngkaError extends Error {}

export class IngkaHttpError extends Error {
  err: AxiosError;
  constructor(message: string, err: AxiosError) {
    super(message);
    this.name = 'IngkaHttpError'
    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
    this.err = err;
  }
}

export class IngkaParseError extends IngkaError {
  data: unknown;
  constructor(message: string, data: unknown = null) {
    super(message);
    this.name = 'IngkaParseError'
    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
    this.data = data;
  }
}

export class IngkaResponseError extends Error {
  // contains the original response that raised the error /
  response: AxiosResponse;
  constructor(message: string, response: AxiosResponse) {
    super(message);
    this.name = 'IngkaResponseError'
    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
    this.response = response;
  }
}
