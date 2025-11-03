import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(field: string, reason?: string) {
    super('Bad request', 400, `Invalid value for "${field}": ${reason}`);
  }
}
