import Redis from 'ioredis';

const client = new Redis(process.env.REDIS_URL!);

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

export { client };
