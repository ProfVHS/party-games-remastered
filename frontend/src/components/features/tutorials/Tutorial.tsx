import './Tutorial.scss';
import { useEffect, useState } from 'react';
import { MinigameNamesEnum } from '@shared/types';
import { Button } from '@components/ui/button/Button.tsx';
import { Pagination } from '@components/features/tutorials/components/Pagination.tsx';
import { Text } from '@components/features/tutorials/components/Text.tsx';
import { ClickTheBombTutorial } from '@components/features/tutorials/minigamesTutorials/clickTheBomb.tsx';
import { socket } from '@socket';

const maxPagesByGame: Record<MinigameNamesEnum, number> = {
  [MinigameNamesEnum.clickTheBomb]: 3,
  [MinigameNamesEnum.cards]: 3,
  [MinigameNamesEnum.colorsMemory]: 2,
};

type TutorialProps = {
  minigameName: MinigameNamesEnum;
};

import { MIN_PLAYERS_TO_START } from '@shared/constants/gameRules.ts';
import { CardsTutorial } from '@components/features/tutorials/minigamesTutorials/cards.tsx';

export const Tutorial = ({ minigameName }: TutorialProps) => {
  const [page, setPage] = useState<number>(1);
  const [ready, setReady] = useState<boolean>(false);
  const [readyPlayers, setReadyPlayers] = useState<number>(0);
  const [maxPlayers, setMaxPlayers] = useState<number>(MIN_PLAYERS_TO_START);
  const maxPage = maxPagesByGame[minigameName];

  const handleChangePage = (delta: number) => {
    if (page + delta < 1 || page + delta > maxPage) return;

    setPage((prev) => prev + delta);
  };

  const handleReady = () => {
    setReady(true);
    socket.emit('end_tutorial_queue');
  };

  useEffect(() => {
    socket.on('tutorial_queue_players', (playersReady: number, maxPlayers: number) => {
      setReadyPlayers(playersReady);
      setMaxPlayers(maxPlayers);
    });

    return () => {
      socket.off('tutorial_queue_players');
    };
  }, [readyPlayers, maxPlayers]);

  return (
    <div className="tutorial__overlay">
      {!ready ? (
        <>
          <div className="tutorial">
            <Text variant="title">How To Play?</Text>
            <div className="tutorial__content">
              {minigameName === MinigameNamesEnum.clickTheBomb && <ClickTheBombTutorial page={page} />}
              {minigameName === MinigameNamesEnum.cards && <CardsTutorial page={page} />}
            </div>
            <Pagination page={page} maxPages={maxPage} onClick={handleChangePage} />
          </div>
          <div className="tutorial__ready--button">
            <Button onClick={handleReady}>Ready</Button>
          </div>
        </>
      ) : (
        <>
          <div className="tutorial">
            <Text variant="title">Waiting for other players</Text>
            <div className="tutorial__ready">
              {[...Array(maxPlayers)].map((_, i) => (
                <div className={`tutorial__ready--dot ${i < readyPlayers ? 'active' : ''}`} key={i}></div>
              ))}
            </div>
            <Text variant="title" color="highlight">
              {readyPlayers} / {maxPlayers}
            </Text>
          </div>
        </>
      )}
    </div>
  );
};
