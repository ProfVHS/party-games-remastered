import './Tutorial.scss';
import { MinigameNamesEnum } from '@shared/types';
import { Button } from '@components/ui/button/Button.tsx';
import { Pagination } from '@components/features/tutorials/components/Pagination.tsx';
import { Text } from '@components/features/tutorials/components/Text.tsx';
import { ClickTheBombTutorial } from '@components/features/tutorials/minigamesTutorials/clickTheBomb.tsx';
import { CardsTutorial } from '@components/features/tutorials/minigamesTutorials/cards.tsx';
import { TrickyDiamondsTutorial } from '@components/features/tutorials/minigamesTutorials/trickyDiamonds.tsx';
import { Stopwatch } from '@components/ui/stopwatch/Stopwatch.tsx';
import { useTutorialSocket } from '@sockets/tutorialSocket.ts';
import { COUNTDOWN } from '@shared/constants/gameRules.ts';
import { useRoomStore } from '@stores/roomStore.ts';

type TutorialProps = {
  minigameName: MinigameNamesEnum;
};

export const Tutorial = ({ minigameName }: TutorialProps) => {
  const { ready, readyPlayers, maxPlayers, page, maxPage, handleChangePage, handleReady } = useTutorialSocket(minigameName);
  const roomData = useRoomStore((state) => state.roomData);

  return (
    <div className="tutorial__overlay">
      {!ready ? (
        <>
          <div className="tutorial">
            <div className="tutorial__header">
              <Text variant="title">How To Play?</Text>
              <div className="tutorial__header__stopwatch">{roomData && <Stopwatch durationMs={COUNTDOWN.TUTORIAL_MS} endAt={roomData.endAt} />}</div>
            </div>
            <div className="tutorial__content">
              {minigameName === MinigameNamesEnum.CLICK_THE_BOMB && <ClickTheBombTutorial page={page} />}
              {minigameName === MinigameNamesEnum.CARDS && <CardsTutorial page={page} />}
              {minigameName === MinigameNamesEnum.TRICKY_DIAMONDS && <TrickyDiamondsTutorial page={page} />}
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
