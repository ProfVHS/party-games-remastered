import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor(resource: string, roomCode: string) {
    super(`${resource} not found`, 404, `${resource} not found for room: ${roomCode}`);
  }
}
