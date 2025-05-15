import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

class ErrorHandler {
  public handle(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    console.error('Erro:', err);

    const errorResponse: ErrorResponse = {
      status: 'error',
      message: err.message || 'Erro interno do servidor'
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = err.stack;
    }

    res.status(500).json(errorResponse);
  }
}

const errorHandlerInstance = new ErrorHandler();

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => errorHandlerInstance.handle(err, req, res, next);
