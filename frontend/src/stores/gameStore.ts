import { create } from 'zustand';
import { TurnType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';

type TurnStoreProps = {
  type: 'ROUND' | 'TURN' | null;
  currentRound: number | null;
  currentTurn: TurnType | null;
  durationRoundOrTurn: number;
  isMyTurn: boolean;
  setType: (type: 'ROUND' | 'TURN' | null) => void;
  setRound: (round: number) => void;
  setTurn: (turn: TurnType | null) => void;
  setDurationRoundOrTurn: (newDuration: number) => void;
};

export const useGameStore = create<TurnStoreProps>((set) => ({
  type: null,
  currentRound: null,
  currentTurn: null,
  durationRoundOrTurn: 0,
  isMyTurn: false,
  setType: (type: 'ROUND' | 'TURN' | null) => set({ type }),
  setRound: (round: number) => set({ currentRound: round }),
  setTurn: (nextTurn: TurnType | null) => {
    const currentPlayer = usePlayersStore.getState().currentPlayer;
    const isMyTurn = nextTurn?.id === currentPlayer?.id;

    set({ currentTurn: nextTurn, isMyTurn: isMyTurn });
  },
  setDurationRoundOrTurn: (newDuration: number) => {
    set({ durationRoundOrTurn: newDuration ?? 0 });
  },
}));
