import { client } from '../config/db';

export async function createRoom(roomCode: string, nickname: string) {
  await client.hSet(`room:${roomCode}:status`, {
    minigame: 'null',
    state: 'waiting',
  });

  await client.hSet(`room:${roomCode}:players`, {
    [nickname]: JSON.stringify({ points: 0, isAlive: true }),
  });

  await client.zAdd(`room:${roomCode}:leaderboard`, { score: 0, value: `${nickname}` });
}

export async function joinRoom(roomCode: string, nickname: string): Promise<boolean> {
  const exists = await client.exists(`room:${roomCode}:players`);

  if (!exists) return false;

  const playerCount = await client.hLen(`room:${roomCode}:players`);
  const isFull = playerCount == 8;

  if (isFull) return false;

  await client.hSet(`room:${roomCode}:players`, `${nickname}`, JSON.stringify({ points: 0, isAlive: true }));

  await client.zAdd(`room:${roomCode}:leaderboard`, { score: 0, value: `${nickname}` });
  return true;
}
