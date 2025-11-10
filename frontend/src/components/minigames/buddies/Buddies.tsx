import { Input } from '@components/ui/input/Input.tsx';

import './Buddies.scss';
import { useState } from 'react';
import { Button } from '@components/ui/button/Button.tsx';

const title = {
  creating_questions: 'Enter The Question',
  waiting_for_players: "Waiting for the other players",
  answer: 'Answer',
  select_best_answer: 'Select The Best Answer',
  show_best_answer: 'The Best Answer is',
};
export const Buddies = () => {
  const [stage, setStage] = useState<'creating_questions' | 'waiting_for_players' | 'answer' | 'select_best_answer' | 'show_best_answer'>('creating_questions');
  const [question, setQuestion] = useState('');

  return (
    <div className="buddies">
      <span className="buddies__title">{title[stage]}</span>
      <Input placeholder="Question"  />
      <Button color="primary" onClick={() => setStage('answer')}>
        Save
      </Button>
    </div>
  );
};
