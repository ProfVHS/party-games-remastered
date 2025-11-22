import './Buddies.scss';
import { CreatingQuestionStage } from '@components/minigames/buddies/stages/CreatingQuestionStage.tsx';
import { WaitingForPlayersStage } from '@components/minigames/buddies/stages/WaitingForPlayersStage.tsx';
import { AnswerStage } from '@components/minigames/buddies/stages/AnswerStage.tsx';
import { WaitingForAnswersStage } from '@components/minigames/buddies/stages/WaitingForAnswersStage.tsx';
import { SelectBestAnswerStage } from '@components/minigames/buddies/stages/SelectBestAnswerStage.tsx';
import { ShowBestAnswerStage } from '@components/minigames/buddies/stages/ShowBestAnswerStage.tsx';
import { useState } from 'react';

export const Buddies = () => {
  const [stage, setStage] = useState<
    'creating_questions' | 'waiting_for_players' | 'waiting_for_answers' | 'answer' | 'select_best_answer' | 'show_best_answer'
  >('creating_questions');

  const handleQuestionCreated = () => {
    setStage('answer');
  };

  const handleAnswerCreated = () => {
    setStage('select_best_answer');
  };

  return (
    <div className="buddies">
      {stage === 'creating_questions' && <CreatingQuestionStage onSubmit={() => handleQuestionCreated()} />}
      {stage === 'waiting_for_players' && <WaitingForPlayersStage />}
      {stage === 'answer' && <AnswerStage onSubmit={() => handleAnswerCreated()} />}
      {stage === 'waiting_for_answers' && <WaitingForAnswersStage />}
      {stage === 'select_best_answer' && <SelectBestAnswerStage />}
      {stage === 'show_best_answer' && <ShowBestAnswerStage />}
    </div>
  );
};
