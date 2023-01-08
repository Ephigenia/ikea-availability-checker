import { AxiosError, AxiosResponse } from "axios";

export class IngkaError extends Error {}

export class IngkaParseError extends IngkaError{
  data: unknown;
  constructor(message: string, data: unknown = null) {
    super(message);
    this.data = data;
  }
}

export class IngkaResponseError extends IngkaError {
  res?: AxiosResponse;
  constructor(message: string, error?: AxiosError) {
    super(message);
    Object.assign(this, error);
    if (error) {
      this.res = error.request.res;
    }
  }
}

export class IngkaNotFoundError extends IngkaResponseError {}
