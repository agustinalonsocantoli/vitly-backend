export const handleErrors = (err, res, logger) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    logger.error(err)

    res.status(statusCode).json({
        message: message,
        error: err
    });
}

export const createError = (status, message) => {
    const error = new Error(message);
    error.statusCode = status;
    throw error;
}