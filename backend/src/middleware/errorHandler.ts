import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/image';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Unhandled error:', error);

  const errorResponse: ErrorResponse = {
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    timestamp: new Date().toISOString()
  };

  res.status(500).json(errorResponse);
};