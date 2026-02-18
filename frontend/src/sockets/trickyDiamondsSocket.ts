import { useEffect, useState } from 'react';
import { socket } from '@socket';
import { PlayerType } from '@shared/types';
import { usePlayersStore } from '@stores/playersStore.ts';
import { DiamondType } from '@shared/types';
import { useRoomStore } from '@stores/roomStore.ts';

export const useTrickyDiamondsSocket = () => {
  const [selectedDiamond, setSelectedDiamond] = useState<number>(-100);
  const [diamonds, setDiamonds] = useState<DiamondType[]>([
    { id: 0, players: [], won: false },
    { id: 1, players: [], won: false },
    { id: 2, players: [], won: false },
  ]);
  const [gameStatus, setGameStatus] = useState<'Judgment Time' | 'Choose Wisely'>('Choose Wisely');
  const [reveal, setReveal] = useState<boolean>(false);
  const setPlayers = usePlayersStore((state) => state.setPlayers);
  const updateEndAt = useRoomStore((state) => state.updateEndAt);
  const roomData = useRoomStore((state) => state.roomData);

  useEffect(() => {
    socket.on('round_end', handleRoundEnd);

    return () => {
      socket.off('round_end', handleRoundEnd);
    };
  }, []);

  useEffect(() => {
    if (!roomData || !roomData.endAt || gameStatus === 'Choose Wisely') return;

    const now = Date.now();
    const timeLeft = roomData.endAt - now;

    if (timeLeft <= 0) {
      handleRoundNext();
      return;
    }

    const timer = setTimeout(() => {
      handleRoundNext();
    }, timeLeft);

    return () => clearTimeout(timer);
  }, [roomData]);

  const handleRoundEnd = (endAt: number, players: PlayerType[], diamonds: DiamondType[]) => {
    setGameStatus('Judgment Time');
    setReveal(true);
    setSelectedDiamond(-100);
    setDiamonds(diamonds);
    setPlayers(players);
    updateEndAt(endAt);
  };

  const handleRoundNext = () => {
    setGameStatus('Choose Wisely');
    setReveal(false);
    setSelectedDiamond(-100);
  };

  const handleSelectDiamond = (diamondId: number) => {
    if (reveal) return;

    setSelectedDiamond(diamondId);
    socket.emit('player_selection', diamondId);
  };

  return { diamonds, reveal, gameStatus, selectedDiamond, handleSelectDiamond };
};
