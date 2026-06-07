import Redis from 'ioredis';
import { config } from '../config';

export const redis = new Redis(config.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
});

redis.on('error', (err) => {
  console.error('Redis error:', err.message);
});

const CACHE_TTL_SECONDS = 90 * 60; // 90 minutes

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export async function setCached(key: string, value: unknown, ttl = CACHE_TTL_SECONDS): Promise<void> {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch (err) {
    console.error('Redis set error:', err);
  }
}

export function buildCacheKey(game: string, region: string, name: string): string {
  return `stats:${game}:${region}:${name.toLowerCase().replace(/\s+/g, '')}`;
}
