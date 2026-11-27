/**
 * Async Handler
 *
 * Purpose:
 * Automatically catches errors from asynchronous
 * controller functions and passes them to Express
 * error-handling middleware.
 *
 * Used by all backend developers.
 */

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default asyncHandler;