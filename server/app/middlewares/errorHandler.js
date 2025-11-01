export default function errorHandler(err, req, res, _next) {
  const status = err.status || err.code || 500;
  const message = err.message || 'Внутренняя ошибка сервера';

  // Avoid leaking stacks in production
  const response = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  console.error('Global error handler:', err);
  res.status(Number(status) || 500).json(response);
}
