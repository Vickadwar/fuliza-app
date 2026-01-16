import { createClient } from 'redis';

// Define the type for the global object to hold the Redis client
type GlobalWithRedis = typeof globalThis & {
  redis: ReturnType<typeof createClient>;
};

const globalForRedis = global as GlobalWithRedis;

export const redis =
  globalForRedis.redis ||
  createClient({
    url: process.env.REDIS_URL,
    socket: {
      // Reconnect strategy: exponential backoff
      reconnectStrategy: (retries) => {
        if (retries > 20) {
          console.error('Redis: Too many retries, giving up.');
          return new Error('Too many retries on REDIS');
        } 
        return Math.min(retries * 100, 3000); // Wait up to 3 seconds
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

redis.on('error', (err) => console.error('Redis Client Error:', err));
redis.on('connect', () => console.log('Redis Client Connected'));

export async function getRedisClient() {
  if (!redis.isOpen) {
    await redis.connect();
  }
  return redis;
}