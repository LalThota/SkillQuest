import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

const parseEnv = () => {
  const env = envSchema.safeParse(process.env);
  if (!env.success) {
    console.error('Invalid environment variables', env.error.format());
    process.exit(1);
  }
  return env.data;
};

export const env = parseEnv();
