import { Answer } from '@components/minigames/buddies/components/Answer.tsx';
import { useState } from 'react';

export const SelectBestAnswerStage = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  return (
    <>
      <span className="buddies__title">Select The Best Answer</span>
      <span className="buddies__nickname">Ultra Mango Guy</span>
      <span className="buddies__question">Question</span>
      <div className="buddies__answers">
        {[
          { id: 'id1', content: 'Cool' },
          { id: 'id2', content: 'Fast' },
          {
            id: 'id3',
            content: 'Sniper',
          },
        ].map((answer) => (
          <Answer key={answer.id} answer={answer.content} isSelected={selectedAnswer === answer.id} onClick={() => setSelectedAnswer(answer.id)} />
        ))}
      </div>
    </>
  );
};
