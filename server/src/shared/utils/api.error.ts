export enum ErrorCode {
    BadRequest = 'BAD_REQUEST',
    Unauthorized = 'UNAUTHORIZED',
    InvalidToken = 'INVALID_TOKEN',
    Forbidden = 'FORBIDDEN',
    NotFound = 'NOT_FOUND',
    ValidationError = 'VALIDATION_ERROR',
    TooManyRequests = 'TOO_MANY_REQUEST',
    InvalidJson = 'INVALID_JSON',
    PayloadTooLarge = 'PAYLOAD_TOO_LARGE',
    InternalError = 'INTERNAL_ERROR',
    Conflict = 'CONFLICT',
    BadGateway = 'BAD_GATEWAY',
    ServiceUnavailable = 'SERVICE_UNAVAILABLE',
    NotImplemented = 'NOT_IMPLEMENTED',
}

export class ApiError extends Error {
    readonly statusCode: number;
    readonly code: ErrorCode;
    readonly stack!: string;

    constructor(statusCode: number, code: ErrorCode, message: string, stack: string = '') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        if (stack) this.stack = stack;
        else Error.captureStackTrace(this, this.constructor);
    }
}
