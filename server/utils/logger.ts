import { createConsola } from 'consola';

export const logger = createConsola({
  // Use a tag to identify logs from the server application
  defaults: {
    tag: 'app',
  },
  // Adjust log level based on environment if needed, or rely on defaults
  // level: process.env.NODE_ENV === 'production' ? 3 : 4,
});

