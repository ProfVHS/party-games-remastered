import { create } from 'zustand';
import { TurnType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';

type TurnStoreProps = {
  currentTurn: TurnType | null;
  isMyTurn: boolean;
  setTurn: (turn: TurnType) => void;
};

export const useTurnStore = create<TurnStoreProps>((set) => ({
  currentTurn: null,
  isMyTurn: false,
  setTurn: (turn: TurnType) => {
    const currentPlayer = usePlayersStore.getState().currentPlayer;
    const isMyTurn = turn?.id === currentPlayer?.id;

    set({ currentTurn: turn, isMyTurn: isMyTurn });
  },
}));
