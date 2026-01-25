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
  setTurn: (turn: TurnType) => {
    const currentPlayer = usePlayersStore.getState().currentPlayer;
    const isMyTurn = turn?.id === currentPlayer?.id;

    set({ currentTurn: turn, isMyTurn: isMyTurn });
  },
  setTurnEndAt: (endAt: number) => set({ endAt }),
}));
