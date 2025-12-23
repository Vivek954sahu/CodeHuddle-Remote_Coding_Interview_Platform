import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

/**
 * Global Error Handler 
 */
export const globalErrHandler = (err, req, res, next) => {
    let error = err;

    /**
     * Convert errors into ApiError
     */
    if (!(error instanceof ApiError)) {
        error = new ApiError(
            500,
            "Internal Server Error",
            {
                code: "UNEXPECTED_ERROR",
            }
        );
    }

    const statusCode = error.statusCode || 500;

    /**
     * Logging errors 
     */
    if(process.env.NODE_ENV === "production"){
        logger.error(error.message);
    } else {
        logger.error(error);
    }

    /**
     * Response Payload
     */
    const response = {
        success: false,
        message: error.message,
    };

    /**
     * Validation errors
     */
    if(error.errors) {
        response.errors = error.errors;
    }

    // Debug info 
    if(process.env.NODE_ENV !== "production"){
        response.stack = error.stack;
    }

    res.status(statusCode).json(response);
};