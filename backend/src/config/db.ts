import { createClient } from 'redis';

const client = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function connectToRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
}

connectToRedis();

export { client };
