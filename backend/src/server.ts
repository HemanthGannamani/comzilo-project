import app from './app';
import { env } from './config/env';
import { logger } from './shared/logging/logger';
import { connectDatabase, disconnectDatabase } from './config/database';
import { bootstrapDefaultData } from './database/helpers/bootstrap';

const startServer = async () => {
  try {
    // Validate database connection on startup
    await connectDatabase();

    // Auto-bootstrap system defaults (Default Tenant, Store, Domain, Super Admin)
    await bootstrapDefaultData();

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });

    // Graceful Shutdown Handler
    const handleGracefulShutdown = (signal: string) => {
      logger.warn(`Received ${signal}. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed.');
        await disconnectDatabase();
        process.exit(0);
      });

      // Force shutdown after 10s if connections persist
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Fatal error during startup:', error);
    process.exit(1);
  }
};

startServer();
