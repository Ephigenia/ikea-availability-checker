export class IOWS2DeprecatedError extends IOWS2ResponseError {
}
export class IOWS2Error extends Error {
}
export class IOWS2NotFoundError extends IOWS2ResponseError {
}
export class IOWS2ParseError extends IOWS2Error {
    constructor(message: any, data: any);
    data: any;
}
export class IOWS2ResponseError extends IOWS2Error {
    /**
     * @param {import('axios').AxiosError} error Axios Error object
     */
    constructor(error: import('axios').AxiosError);
}
//# sourceMappingURL=iows2Errors.d.ts.map