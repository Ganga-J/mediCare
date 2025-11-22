class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Maintain proper stack trace (only in V8 engines like Node.js)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    static badRequest(message = 'Bad Request') {
        return new CustomError(message, 400);
    }

    static unauthorized(message = 'Unauthorized') {
        return new CustomError(message, 401);
    }

    static forbidden(message = 'Forbidden') {
        return new CustomError(message, 403);
    }

    static notFound(message = 'Not Found') {
        return new CustomError(message, 404);
    }

    static conflict(message = 'Conflict') {
        return new CustomError(message, 409);
    }

    static tooManyRequests(message = 'Too Many Requests') {
        return new CustomError(message, 429);
    }

    static internal(message = 'Internal Server Error') {
        return new CustomError(message, 500);
    }

    static serviceUnavailable(message = 'Service Unavailable') {
        return new CustomError(message, 503);
    }
}

module.exports = CustomError;