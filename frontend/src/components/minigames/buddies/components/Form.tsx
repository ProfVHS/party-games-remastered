import { Input } from '@components/ui/input/Input.tsx';
import { Button } from '@components/ui/button/Button.tsx';
import { useForm } from 'react-hook-form';
import { Row } from '@components/ui/row/Row.tsx';

type FormProps = {
  stage: 'question' | 'answer';
  onSubmit: (values: FormInputs) => void;
};

type FormInputs = {
  question: string;
  answer: string;
};

export const Form = ({ stage, onSubmit }: FormProps) => {
  const { register, handleSubmit, watch } = useForm<FormInputs>();
  const textInput = watch(stage, '');

  return (
    <form className="buddies__form" onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Input
          className="buddies__input"
          placeholder="Question"
          maxLength={80}
          register={register(stage, {
            required: 'Input cannot be empty!',
            maxLength: 80,
          })}
        />
        <span className="buddies__character-counter">{textInput.length}/80</span>
      </Row>
      <Button className="buddies__button" color="primary" type="submit">
        {stage === 'answer' ? 'Answer' : 'Save'}
      </Button>
    </form>
  );
};
