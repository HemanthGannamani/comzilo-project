import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.preprocess((val) => Number(val), z.number().default(5000)),

  // Development Database Configuration
  DB_HOST: z.string().min(1),
  DB_PORT: z.preprocess((val) => Number(val), z.number().default(3306)),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().default(''),
  DB_POOL_MIN: z.preprocess((val) => Number(val), z.number().default(0)),
  DB_POOL_MAX: z.preprocess((val) => Number(val), z.number().default(10)),
  DB_POOL_ACQUIRE: z.preprocess((val) => Number(val), z.number().default(30000)),
  DB_POOL_IDLE: z.preprocess((val) => Number(val), z.number().default(10000)),
  DB_LOGGING: z.preprocess((val) => val === 'true', z.boolean().default(false)),
  DB_SSL: z.preprocess((val) => val === 'true', z.boolean().default(false)),

  // Test Database Configuration
  TEST_DB_HOST: z.string().min(1),
  TEST_DB_PORT: z.preprocess((val) => Number(val), z.number().default(3306)),
  TEST_DB_NAME: z.string().min(1),
  TEST_DB_USER: z.string().min(1),
  TEST_DB_PASSWORD: z.string().default(''),
  TEST_DB_POOL_MIN: z.preprocess((val) => Number(val), z.number().default(0)),
  TEST_DB_POOL_MAX: z.preprocess((val) => Number(val), z.number().default(5)),
  TEST_DB_POOL_ACQUIRE: z.preprocess((val) => Number(val), z.number().default(30000)),
  TEST_DB_POOL_IDLE: z.preprocess((val) => Number(val), z.number().default(10000)),

  // Auth Configuration
  JWT_ACCESS_SECRET: z.string().min(8),
  JWT_REFRESH_SECRET: z.string().min(8),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  COOKIE_DOMAIN: z.string().default('localhost'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  CORS_ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),

  BCRYPT_ROUNDS: z.preprocess((val) => Number(val), z.number().default(10)),

  SUPER_ADMIN_EMAIL: z.string().email(),
  SUPER_ADMIN_PASSWORD: z.string().min(8),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error(
    '❌ Environment validation failed:',
    JSON.stringify(parsed.error.format(), null, 2)
  );
  process.exit(1);
}

export const env = parsed.data;
