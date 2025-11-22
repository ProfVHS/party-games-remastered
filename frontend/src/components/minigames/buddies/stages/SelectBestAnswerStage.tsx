import { Answer } from '@components/minigames/buddies/components/Answer.tsx';
import { useState } from 'react';
import { Button } from '@components/ui/button/Button.tsx';

type SelectBestAnswerStageProps = {
  onSelectAnswer: (answerId: string) => void;
};

export const SelectBestAnswerStage = ({ onSelectAnswer }: SelectBestAnswerStageProps) => {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);

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
          <Answer key={answer.id} answer={answer.content} isSelected={selectedAnswerId === answer.id} onClick={() => setSelectedAnswerId(answer.id)} />
        ))}
      </div>
      <Button onClick={() => selectedAnswerId && onSelectAnswer(selectedAnswerId)}>Confirm</Button>
    </>
  );
};
