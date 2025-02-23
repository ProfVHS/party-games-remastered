import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function connectToRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
}

connectToRedis();

export { client };
