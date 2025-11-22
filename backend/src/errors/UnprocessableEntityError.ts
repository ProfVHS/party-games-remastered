import { AppError } from './AppError';

export class UnprocessableEntityError extends AppError {
  constructor(field: string, expected: string, received: string) {
    super(`Invalid ${field}`, 422, `Expected ${expected}, got ${received}`);
  }
}
