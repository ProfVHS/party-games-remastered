import { BaseMinigame } from './baseMinigame';
import * as roomRepository from '@roomRepository';
import { ChainableCommander } from 'ioredis';
import { client } from '@config/db';
import { ReadyNameEnum, ScheduledNameEnum } from '@backend-types';
import { MinigameNamesEnum } from '@shared/types';
import { cardsRound, trickyDiamondsRound } from '@sockets';

export abstract class RoundBasedMinigame extends BaseMinigame {
  async endRound() {
    const minigameData = await roomRepository.getMinigameData(this.roomCode);
    let multi: ChainableCommander;

    if (!minigameData) {
      console.error("Couldn't find minigame data.");
    }

    try {
      multi = client.multi();
      await roomRepository.deleteScheduled(this.roomCode, ScheduledNameEnum.rounds);
      await roomRepository.deleteReadyTable(this.roomCode, ReadyNameEnum.round);

      switch (minigameData?.minigameName) {
        case MinigameNamesEnum.cards:
          await cardsRound(this.socket);
          break;
        case MinigameNamesEnum.trickyDiamonds:
          await trickyDiamondsRound(this.socket);
          break;
        default:
          console.error('Tried start round for non existing game: ', minigameData?.minigameName);
          break;
      }

      await multi.exec();
    } catch (error) {
      console.error(`Round start failed for room ${this.roomCode}: ${error}`);
      return { success: false };
    }
  }
}
