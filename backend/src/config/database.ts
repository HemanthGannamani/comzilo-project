import {
  Sequelize,
  ConnectionError,
  TimeoutError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} from 'sequelize';
import { env } from './env';
import { logger } from '../shared/logging/logger';
import { AppError } from '../shared/errors/AppError';

const isTest = env.NODE_ENV === 'test';

// Test Database Security Check
if (isTest) {
  if (!env.TEST_DB_NAME) {
    throw new Error('Test database name is not defined in environments.');
  }
  if (!env.TEST_DB_NAME.toLowerCase().includes('test')) {
    throw new Error(
      `Safety check failed: Test database name '${env.TEST_DB_NAME}' does not contain 'test'.`
    );
  }
}

const dbName = isTest ? env.TEST_DB_NAME : env.DB_NAME;
const dbUser = isTest ? env.TEST_DB_USER : env.DB_USER;
const dbPassword = isTest ? env.TEST_DB_PASSWORD : env.DB_PASSWORD;
const dbHost = isTest ? env.TEST_DB_HOST : env.DB_HOST;
const dbPort = isTest ? env.TEST_DB_PORT : env.DB_PORT;
const dbPoolMin = isTest ? env.TEST_DB_POOL_MIN : env.DB_POOL_MIN;
const dbPoolMax = isTest ? env.TEST_DB_POOL_MAX : env.DB_POOL_MAX;
const dbPoolAcquire = isTest ? env.TEST_DB_POOL_ACQUIRE : env.DB_POOL_ACQUIRE;
const dbPoolIdle = isTest ? env.TEST_DB_POOL_IDLE : env.DB_POOL_IDLE;
const dbLogging = isTest ? false : env.DB_LOGGING;
const dbSsl = env.DB_SSL;

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  timezone: '+00:00', // UTC timestamps
  logging: dbLogging ? (sql: string) => logger.debug(sql) : false,
  dialectOptions: {
    ssl: dbSsl ? { rejectUnauthorized: true } : false,
  },
  pool: {
    min: dbPoolMin,
    max: dbPoolMax,
    acquire: dbPoolAcquire,
    idle: dbPoolIdle,
  },
  define: {
    underscored: true,
    timestamps: true,
  },
  retry: {
    match: [
      /ConnectionError/,
      /TimeoutError/,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /Timeout/,
    ],
    max: 3, // Retry up to 3 times for transient connection failures
  },
});

// Database Error Mapper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDatabaseError = (err: any): AppError => {
  if (err instanceof ConnectionError) {
    return new AppError(
      'Database connection was refused or lost',
      503,
      'DATABASE_CONNECTION_ERROR'
    );
  }
  if (err instanceof TimeoutError) {
    return new AppError('Database transaction timed out', 504, 'DATABASE_TIMEOUT');
  }
  if (err instanceof UniqueConstraintError || err instanceof ForeignKeyConstraintError) {
    return new AppError(
      'Database integrity constraint violated',
      409,
      'DATABASE_CONSTRAINT_ERROR',
      (err as unknown as { errors: unknown[] }).errors
    );
  }
  return new AppError('Database is currently unavailable', 503, 'DATABASE_UNAVAILABLE');
};

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info(
      `✅ MySQL Database connection established successfully to [${isTest ? 'TEST' : env.NODE_ENV.toUpperCase()}] env.`
    );
  } catch (error: unknown) {
    logger.error('Failed to establish database connection during startup.');
    throw handleDatabaseError(error);
  }
};

export const disconnectDatabase = async () => {
  try {
    await sequelize.close();
    logger.info('Database connection closed cleanly.');
  } catch (error) {
    logger.error('Error closing database connection:', error);
  }
};

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
};

export const getSequelize = (): Sequelize => {
  return sequelize;
};
