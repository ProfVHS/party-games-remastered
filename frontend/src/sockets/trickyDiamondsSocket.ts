import { useEffect, useState } from 'react';
import { socket } from '@socket';
import { PlayerType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';
import { DiamondType } from '@shared/types';

export const useTrickyDiamondsSocket = () => {
  const [round, setRound] = useState<number>(1);
  const [roundEndAt, setRoundEndAt] = useState(0);
  const [selectedDiamond, setSelectedDiamond] = useState<number>(-100);
  const [diamonds, setDiamonds] = useState<DiamondType[]>([
    { id: 0, players: [], won: false },
    { id: 1, players: [], won: false },
    { id: 2, players: [], won: false },
  ]);
  const [reveal, setReveal] = useState<boolean>(false);
  const setPlayers = usePlayersStore((state) => state.setPlayers);

  useEffect(() => {
    socket.on('round_end', handleRoundEnd);
    socket.on('round_next', handleRoundNext);
    socket.on('round_timeout', handleRoundTimeout);

    return () => {
      socket.off('round_end', handleRoundEnd);
      socket.off('round_next', handleRoundNext);
      socket.off('round_timeout', handleRoundTimeout);
    };
  }, []);

  const handleRoundEnd = (diamonds: DiamondType[], players: PlayerType[]) => {
    setReveal(true);
    setSelectedDiamond(-100);
    setDiamonds(diamonds);
    setPlayers(players);
  };

  const handleRoundNext = (nextRound: number) => {
    setRound(nextRound);
    setReveal(false);
    setSelectedDiamond(-100);
  };

  const handleRoundTimeout = (endAt: number) => {
    setRoundEndAt(endAt);
  };

  const handleSelectDiamond = (diamondId: number) => {
    if (reveal) return;

    setSelectedDiamond(diamondId);
    socket.emit('player_selection', diamondId);
  };

  return { diamonds, round, roundEndAt, reveal, selectedDiamond, handleSelectDiamond };
};
