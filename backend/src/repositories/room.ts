import { client } from '../config/db';

export async function createRoom(roomCode: string, nickname: string) {
  const statusKey = `room:${roomCode}:status`;
  const playersKey = `room:${roomCode}:players`;
  const leaderboardKey = `room:${roomCode}:leaderboard`;

  const multi = client.multi();
  multi.hSet(statusKey, { minigame: 'null', state: 'waiting' });
  multi.hSet(playersKey, { [nickname]: JSON.stringify({ points: 0, isAlive: true }) });
  multi.zAdd(leaderboardKey, { score: 0, value: nickname });
  await multi.exec();
}

export async function joinRoom(roomCode: string, nickname: string) {
  const playersKey = `room:${roomCode}:players`;
  const leaderboardKey = `room:${roomCode}:leaderboard`;
  const readySetKey = `room:${roomCode}:readyPlayers`;

  const [exists, playerCount] = await Promise.all([client.exists(playersKey), client.hLen(playersKey)]);

  if (!exists) return -1;
  if (playerCount === 8) return client.sCard(readySetKey);

  const multi = client.multi();
  multi.hSet(playersKey, nickname, JSON.stringify({ points: 0, isAlive: true }));
  multi.zAdd(leaderboardKey, { score: 0, value: nickname });
  await multi.exec();

  return client.sCard(readySetKey);
}

export async function toggleReady(roomCode: string, nickname: string) {
  const playersKey = `room:${roomCode}:players`;
  const readySetKey = `room:${roomCode}:readyPlayers`;

  const [playerData, isReady] = await Promise.all([client.hGet(playersKey, nickname), client.sIsMember(readySetKey, nickname)]);

  if (!playerData) return false;

  const multi = client.multi();

  if (isReady) {
    multi.sRem(readySetKey, nickname);
  } else {
    multi.sAdd(readySetKey, nickname);
  }

  await multi.exec();

  return await client.sCard(readySetKey);
}
