import './Buddies.scss';
import { CreatingQuestionStage } from '@components/minigames/buddies/stages/CreatingQuestionStage.tsx';
import { WaitingForPlayersStage } from '@components/minigames/buddies/stages/WaitingForPlayersStage.tsx';
import { AnswerStage } from '@components/minigames/buddies/stages/AnswerStage.tsx';
import { WaitingForAnswersStage } from '@components/minigames/buddies/stages/WaitingForAnswersStage.tsx';
import { SelectBestAnswerStage } from '@components/minigames/buddies/stages/SelectBestAnswerStage.tsx';
import { ShowBestAnswerStage } from '@components/minigames/buddies/stages/ShowBestAnswerStage.tsx';
import { useBuddiesSocket } from '@components/minigames/buddies/useBuddiesSocket.ts';

export const Buddies = () => {
  const { stage, sendQuestion, sendAnswer, selectBestAnswer } = useBuddiesSocket();

  return (
    <div className="buddies">
      {stage === 'creating_questions' && <CreatingQuestionStage onSubmit={() => sendQuestion()} />}
      {stage === 'waiting_for_players' && <WaitingForPlayersStage />}
      {stage === 'answer' && <AnswerStage onSubmit={() => sendAnswer()} />}
      {stage === 'waiting_for_answers' && <WaitingForAnswersStage />}
      {stage === 'select_best_answer' && <SelectBestAnswerStage onSelectAnswer={selectBestAnswer} />}
      {stage === 'show_best_answer' && <ShowBestAnswerStage />}
    </div>
  );
};
