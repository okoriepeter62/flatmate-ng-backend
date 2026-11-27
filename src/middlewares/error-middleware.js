/**
 * Central Error-Handling Middleware
 *
 * Purpose:
 * Handles application errors from all backend modules
 * and returns a consistent JSON response.
 *
 * Used by all backend developers.
 */

const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const message = err.isOperational
        ? err.message
        : "An unexpected error occurred.";

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack
        })
    });
};

export default errorMiddleware;