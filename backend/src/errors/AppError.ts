import { Socket } from 'socket.io';
import { ErrorEventNameEnum } from '@backend-types';

export class AppError extends Error {
  statusCode: number; // e.g. 400, 404
  isOperational: boolean; // used to distinguish between operational errors and programming bugs
  details?: string;

  constructor(message: string, statusCode = 500, details: string, isOperational = true) {
    super(message); // Call the parent constructor (Error)
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;

    // Fix the prototype chain (important for TypeScript when extending built-in classes)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const formatError = (error: unknown) => {
  if (error instanceof AppError) {
    return {
      code: error.constructor.name.toUpperCase(),
      message: error.message,
      status: error.statusCode,
    };
  }

  return {
    code: 'INTERNAL_ERROR',
    message: 'Unexpected server error',
    status: 500,
  };
};

export const handleSocketError = (socket: Socket, roomCode: string, error: unknown, eventName: ErrorEventNameEnum) => {
  if (error instanceof AppError) {
    console.error(`${eventName}: ${error.message} - ${error.details}`);
  } else if (error instanceof Error) {
    console.error(`${eventName} unexpected: ${error.message}`);
  } else {
    console.error(`${eventName} unknown:`, error);
  }

  const formattedError = formatError(error);
  socket.nsp.to(roomCode).emit(eventName, formattedError);
};
