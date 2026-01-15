import { createClient } from 'redis';

// Define a global type to prevent TypeScript errors on the global object
const globalForRedis = global as unknown as { redis: ReturnType<typeof createClient> };

export const redis =
  globalForRedis.redis ||
  createClient({
    url: process.env.REDIS_URL,
    socket: {
      // Reconnect strategy: try every second, up to 5 times, then wait longer
      reconnectStrategy: (retries) => {
        if (retries > 10) return new Error('Too many retries on REDIS');
        return Math.min(retries * 50, 2000);
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

redis.on('error', (err) => console.error('Redis Client Error:', err));
redis.on('connect', () => console.log('Redis Connected'));

export async function getRedisClient() {
  if (!redis.isOpen) {
    await redis.connect();
  }
  return redis;
}