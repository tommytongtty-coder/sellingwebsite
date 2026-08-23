// Central error handler — must be registered LAST with app.use()
// Catches any error passed to next(err) from controllers
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(`[${req.method} ${req.path}]`, err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: 'Server error',
    detail: err.message,
  });
}
