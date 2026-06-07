import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3001').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  RIOT_API_KEY: z.string().min(1, 'RIOT_API_KEY is required'),
  RIOT_BASE_URL: z.string().default('https://europe.api.riotgames.com'),
  STEAM_API_KEY: z.string().min(1, 'STEAM_API_KEY is required'),
  STEAM_BASE_URL: z.string().default('https://api.steampowered.com'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  parsed.error.issues.forEach(issue => {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  });
  process.exit(1);
}

export const config = parsed.data;
