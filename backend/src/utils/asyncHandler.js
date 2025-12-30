/**
 * Wraps async route handlers and forwards errors to error middleware
 * @param {Function} fn async controller function
 */

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise
        .resolve(fn(req, res, next))
        .catch(next);
    };
};