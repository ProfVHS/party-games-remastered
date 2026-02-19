import './Tutorial.scss';
import { useEffect, useState } from 'react';
import { MinigameNamesEnum } from '@shared/types';
import { Button } from '@components/ui/button/Button.tsx';
import { Pagination } from '@components/features/tutorials/components/Pagination.tsx';
import { Text } from '@components/features/tutorials/components/Text.tsx';
import { ClickTheBombTutorial } from '@components/features/tutorials/minigamesTutorials/clickTheBomb.tsx';
import { socket } from '@socket';
import { COUNTDOWN_TUTORIAL_MS, MIN_PLAYERS_TO_START } from '@shared/constants/gameRules.ts';
import { MAX_PAGES_BY_GAME } from '@shared/constants/defaults.ts';
import { CardsTutorial } from '@components/features/tutorials/minigamesTutorials/cards.tsx';
import { usePlayersStore } from '@stores/playersStore.ts';
import { TrickyDiamondsTutorial } from '@components/features/tutorials/minigamesTutorials/trickyDiamonds.tsx';
import { Stopwatch } from '@components/ui/stopwatch/Stopwatch.tsx';

type TutorialProps = {
  minigameName: MinigameNamesEnum;
};

export const Tutorial = ({ minigameName }: TutorialProps) => {
  const [page, setPage] = useState<number>(1);
  const [ready, setReady] = useState<boolean>(false);
  const [readyPlayers, setReadyPlayers] = useState<number>(0);
  const [maxPlayers, setMaxPlayers] = useState<number>(MIN_PLAYERS_TO_START);
  const maxPage = MAX_PAGES_BY_GAME[minigameName];
  const { players } = usePlayersStore();

  const handleChangePage = (delta: number) => {
    if (page + delta < 1 || page + delta > maxPage) return;

    setPage((prev) => prev + delta);
  };

  const handleReady = () => {
    setReady(true);
    socket.emit('tutorial_player_ready');
  };

  useEffect(() => {
    socket.on('tutorial_ready_status', (playersReady: number) => {
      setReadyPlayers(playersReady);
    });

    return () => {
      socket.off('tutorial_ready_status');
    };
  }, [readyPlayers, maxPlayers]);

  useEffect(() => {
    setMaxPlayers(players.filter((p) => !p.isDisconnected).length);
  }, [players]);

  return (
    <div className="tutorial__overlay">
      {!ready ? (
        <>
          <div className="tutorial">
            <div className="tutorial__header">
              <Text variant="title">How To Play?</Text>
              <div className="tutorial__header__stopwatch">
                <Stopwatch durationMs={COUNTDOWN_TUTORIAL_MS} />
              </div>
            </div>
            <div className="tutorial__content">
              {minigameName === MinigameNamesEnum.clickTheBomb && <ClickTheBombTutorial page={page} />}
              {minigameName === MinigameNamesEnum.cards && <CardsTutorial page={page} />}
              {minigameName === MinigameNamesEnum.trickyDiamonds && <TrickyDiamondsTutorial page={page} />}
            </div>
            <Pagination page={page} maxPages={maxPage} onClick={handleChangePage} />
          </div>
          <div className="tutorial__ready-button">
            <Button onClick={handleReady}>Ready</Button>
          </div>
        </>
      ) : (
        <>
          <div className="tutorial">
            <Text variant="title">Waiting for other players</Text>
            <div className="tutorial__ready">
              {[...Array(maxPlayers)].map((_, i) => (
                <div className={`tutorial__ready-dot ${i < readyPlayers ? 'active' : ''}`} key={i}></div>
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
