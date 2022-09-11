export class IngkaError extends Error {
}
export class IngkaNotFoundError extends IngkaResponseError {
}
export class IngkaParseError extends IngkaError {
    constructor(message: any, data: any);
    data: any;
}
export class IngkaResponseError extends IngkaError {
    /**
     * @param {import('axios').AxiosError} error Axios Error object
     */
    constructor(error: import('axios').AxiosError);
    res: any;
}
//# sourceMappingURL=ingkaErrors.d.ts.map