/**
 * Standard API Success Response
 *
 * Purpose:
 * Ensures all successful API responses follow
 * the same structure across Flatmate NG.
 *
 * Used by all backend developers.
 */

export const sendSuccess = (
    res,
    {
        statusCode = 200,
        message = "Request successful",
        data = null
    } = {}
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};