import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(err.errors && { errors: err.errors })
  });
};

export default errorMiddleware;
