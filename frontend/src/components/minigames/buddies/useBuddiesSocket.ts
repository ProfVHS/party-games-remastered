import { useState } from 'react';
import { BuddiesStageType } from '@shared/types';

export const useBuddiesSocket = () => {
  const [stage, setStage] = useState<BuddiesStageType>('creating_questions');

  const sendQuestion = () => {
    setStage('answer');
  };

  const sendAnswer = () => {
    setStage('select_best_answer');
  };

  const selectBestAnswer = (answerId: string) => {
    console.log(answerId);
    setStage('show_best_answer');
  };

  return {
    stage,
    sendQuestion,
    sendAnswer,
    selectBestAnswer,
  };
};
