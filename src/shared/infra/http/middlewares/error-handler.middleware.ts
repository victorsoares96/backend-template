import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/shared/errors/app-error.error';
import { EGenericError } from '@/shared/utils/enums/errors.enum';

export default function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  _: NextFunction,
): Response {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: 'error',
    message: EGenericError.InternalError,
  });
}
