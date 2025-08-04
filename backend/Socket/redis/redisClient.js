// backend/Socket/redis/redisClient.js
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379' // Default Redis port
});

redis.on('error', (err) => console.error('Redis Client Error', err));

await redis.connect(); // Important for Redis v4+

export default redis;
