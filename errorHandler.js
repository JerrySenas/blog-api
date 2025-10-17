export function errorHandler(err, req, res, next) {
    console.error(`\n${err.stack}\n`);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error.",
    })
}

export function createError(message, status) {
    const err = new Error(message);
    err.status = status;
    return err
}
