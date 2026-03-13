import { authHandlers } from './handlers/auth';
import { adminHandlers } from './handlers/admin';

// Combine all handlers
export const handlers = [
  ...authHandlers,
  ...adminHandlers,
];
