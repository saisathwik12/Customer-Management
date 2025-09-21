function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only show error stack in non-prod
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });
}
module.exports = { errorHandler };
