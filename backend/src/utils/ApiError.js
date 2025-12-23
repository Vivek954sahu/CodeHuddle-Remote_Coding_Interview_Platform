export class ApiError extends Error {
    constructor ( statusCode, message, options = {} ) {
        super(message);

        this.name = "ApiError";
        this.statusCode = statusCode;
        this.isOperational = true;

        // optional metadata not for client
        this.errors = options.errors || null;
        this.code = options.code || null;

        Error.captureStackTrace(this, this.constructor);
    }

/** 
 * Common error helpers
 */
    static badRequest(message = "Bad Request!", options) {
        return new ApiError(400, message, options);
    }

     static unauthorized(message = "Unauthorized!") {
        return new ApiError(401, message);
    }

     static forbidden(message = "Forbidden!") {
        return new ApiError(403, message);
    }

     static notFound(message = "Resource Not Found!") {
        return new ApiError(404, message);
    }

    static internal(message = "Internal Server Error!") {
        return new ApiError(500, message);
    }

};

