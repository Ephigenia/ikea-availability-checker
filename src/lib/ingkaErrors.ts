import { AxiosError, AxiosResponse } from "axios";

export class IngkaError extends Error {}

export class IngkaParseError extends IngkaError{
  data: any;
  constructor(message: string, data: unknown = null) {
    super(message);
    this.data = data;
  }
}

export class IngkaResponseError extends IngkaError {
  res: AxiosResponse;
  constructor(error: AxiosError) {
    super(error.message);
    Object.assign(this, error);
    this.res = error.request.res;
  }
}

export class IngkaNotFoundError extends IngkaResponseError {}
