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

  const exists = await client.exists(`room:${roomCode}:readyPlayers`);
  if (!exists) await client.sAdd(`room:${roomCode}:readyPlayers`, '__init__');
}

export async function joinRoom(roomCode: string, nickname: string) {
  const playersKey = `room:${roomCode}:players`;
  const readySetKey = `room:${roomCode}:readyPlayers`;

  const exists = await client.exists(playersKey);
  if (!exists) {
    return -1;
  }

  const playerCount = await client.hLen(playersKey);
  if (playerCount === 8) {
    return await client.sCard(readySetKey);
  }

  await client.hSet(playersKey, nickname, JSON.stringify({ points: 0, isAlive: true }));
  await client.zAdd(`room:${roomCode}:leaderboard`, { score: 0, value: `${nickname}` });

  return await client.sCard(readySetKey);
}

export async function toggleReady(roomCode: string, nickname: string) {
  const playerKey = `room:${roomCode}:players`;
  const readySetKey = `room:${roomCode}:readyPlayers`;

  const playerData = await client.hGet(playerKey, nickname);
  if (!playerData) return false;

  const isReady = await client.sIsMember(readySetKey, nickname);
  const multi = client.multi();

  if (isReady) {
    multi.sRem(readySetKey, nickname);
  } else {
    multi.sAdd(readySetKey, nickname);
    multi.sRem(readySetKey, '__init__');
  }

  await multi.exec();

  return await client.sCard(readySetKey);
}
