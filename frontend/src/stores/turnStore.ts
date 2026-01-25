import { create } from 'zustand';
import { TurnType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';

type TurnStoreProps = {
  currentTurn: TurnType | null;
  isMyTurn: boolean;
  endAt: number;
  setTurn: (turn: TurnType) => void;
  setTurnEndAt: (endAt: number) => void;
};

export const useTurnStore = create<TurnStoreProps>((set) => ({
  currentTurn: null,
  isMyTurn: false,
  endAt: 0,
  setTurn: (nextTurn: TurnType) => {
    const currentPlayer = usePlayersStore.getState().currentPlayer;
    const isMyTurn = nextTurn?.id === currentPlayer?.id;

    set({ currentTurn: nextTurn, isMyTurn: isMyTurn });
  },
  setTurnEndAt: (endAt: number) => set({ endAt }),
}));
