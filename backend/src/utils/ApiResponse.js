/**
 * Success response class
 */
export class ApiResponse {
    constructor(statusCode, message, data = null, meta = null) {
        this.success = true;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        if(meta) this.meta = meta;
    }
}

/**
 * Attach helpers to response object
 */
export const responseMiddleware = (req, res, next) => {
    /**
     * 200 ok
     */
    res.ok = (data, message = "Success", meta) => {
        return res.status(200).json(
            new ApiResponse(200, message, data, meta)
        );
    };

    /**
     * 201 Created
     */
    res.created = (data, message = "Resource Created") => {
        return res.status(201).json(
            new ApiResponse(201, message, data)
        );
    };

    /**
     *  204 No content
     */
    res.noContent = () => {
        return res.status(204).send();
    };

    next();
}