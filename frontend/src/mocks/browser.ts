import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup MSW worker for browser environment
export const worker = setupWorker(...handlers);

// Start the worker
export const startMockServer = () => {
  if (import.meta.env.DEV) {
    return worker.start({
      onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
  }
};
