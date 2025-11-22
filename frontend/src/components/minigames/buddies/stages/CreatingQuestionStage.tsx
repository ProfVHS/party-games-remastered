import { Form } from '@components/minigames/buddies/components/Form.tsx';

type CreatingQuestionStageProps = {
  onSubmit: () => void;
};

export const CreatingQuestionStage = ({ onSubmit }: CreatingQuestionStageProps) => {
  return (
    <>
      <span className="buddies__title">Enter The Question</span>
      <Form stage="question" onSubmit={onSubmit} />
    </>
  );
};
