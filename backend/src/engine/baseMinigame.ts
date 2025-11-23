import * as roomRepository from '@roomRepository';
import { ChainableCommander } from 'ioredis';
import { client } from '@config/db';
import { PlayerStatusEnum, RoomStatusEnum } from '@shared/types';
import { LockName, ReadyNameEnum } from '@backend-types';

export abstract class BaseMinigame {
  protected playersCount: number = 0;

  constructor(protected readonly roomCode: string) {}

  async init() {
    const players = await roomRepository.getAllPlayers(this.roomCode);
    this.playersCount = players.length;
  }

  abstract start(multi?: ChainableCommander): Promise<any>;

  async end() {
    let multi: ChainableCommander;

    try {
      multi = client.multi();

      await roomRepository.updateFilteredPlayers(
        this.roomCode,
        { isDisconnected: false },
        {
          isAlive: true,
          status: PlayerStatusEnum.idle,
          selectedObjectId: -100,
        },
        multi,
      );
      await roomRepository.updateRoomData(this.roomCode, { status: RoomStatusEnum.leaderboard }, multi);
      await roomRepository.incrementRoomDataMinigameIndex(this.roomCode, multi);
      await roomRepository.deleteReadyTable(this.roomCode, ReadyNameEnum.minigame, multi);
      await roomRepository.deleteLock(this.roomCode, LockName.minigame, multi);

      await multi.exec();
    } catch (error) {
      throw new Error(`Failed to end minigame for room ${this.roomCode}: ${error}`);
    }
  }
}
