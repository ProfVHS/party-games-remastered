import { BaseMinigame } from './baseMinigame';
import { NotFoundError } from '@errors';

type MinigameConstructor = new (...args: any[]) => BaseMinigame;

const registry = new Map<string, MinigameConstructor>();

export const minigameRegistry = {
  register(id: string, ctor: MinigameConstructor) {
    registry.set(id, ctor);
  },
  create(id: string, roomCode: string) {
    const ctor = registry.get(id);
    if (!ctor) throw new NotFoundError('Minigame', roomCode);
    return new ctor(roomCode);
  },
};
