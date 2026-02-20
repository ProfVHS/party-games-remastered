import { MIN_PLAYERS_TO_START } from '@shared/constants/gameRules.ts';
import { MinigameNamesEnum } from '@shared/types';
import { useEffect, useState } from 'react';
import { TUTORIAL_PAGES_BY_GAME } from '@shared/constants/defaults.ts';
import { usePlayersStore } from '@stores/playersStore.ts';
import { socket } from '@socket';

export const useTutorialSocket = (minigameName: MinigameNamesEnum) => {
  const [page, setPage] = useState<number>(1);
  const [ready, setReady] = useState<boolean>(false);
  const [readyPlayers, setReadyPlayers] = useState<number>(0);
  const [maxPlayers, setMaxPlayers] = useState<number>(MIN_PLAYERS_TO_START);
  const maxPage = TUTORIAL_PAGES_BY_GAME[minigameName];
  const players = usePlayersStore((state) => state.players);

  useEffect(() => {
    socket.on('tutorial_ready_status', handleTutorialReady);

    return () => {
      socket.off('tutorial_ready_status', handleTutorialReady);
    };
  }, []);

  useEffect(() => {
    setMaxPlayers(players.filter((p) => !p.isDisconnected).length);
  }, [players]);

  const handleTutorialReady = (playersReady: number) => {
    setReadyPlayers(playersReady);
  };

  const handleChangePage = (delta: number) => {
    if (page + delta < 1 || page + delta > maxPage) return;

    setPage((prev) => prev + delta);
  };

  const handleReady = () => {
    setReady(true);
    socket.emit('tutorial_player_ready');
  };

  return { ready, readyPlayers, maxPlayers, page, maxPage, handleChangePage, handleReady };
};
