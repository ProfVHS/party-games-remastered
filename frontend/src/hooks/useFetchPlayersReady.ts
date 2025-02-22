import { Dispatch, SetStateAction, useEffect } from 'react';
import { socket } from '../socket';

type useJoinRoomProps = {
  setPlayersReady: Dispatch<SetStateAction<number>>;
};

export const useFetchPlayersReady = ({ setPlayersReady }: useJoinRoomProps) => {
  useEffect(() => {
    socket.on('fetch_players_ready', (readyCount: number) => {
      setPlayersReady(readyCount);
    });

    return () => {
      socket.off('fetch_players_ready');
    };
  }, [socket]);
};
