import './Form.scss';

import { useForm, SubmitHandler } from 'react-hook-form';
import {Button} from "../../ui/button/Button.tsx";

interface FormInputs {
  nickname: string;
  room: string;
}

type JoinFormProps = {
  onCancel: () => void;
};

export const JoinForm = ({ onCancel }: JoinFormProps) => {
  const { register, handleSubmit } = useForm<FormInputs>();

  const onJoin: SubmitHandler<FormInputs> = (data) => {
    console.log(data.room, data.nickname);
  };


  return (
    <form className="form" onSubmit={handleSubmit(onJoin)} onReset={onCancel}>
      <input
        className="form-input"
        style={{ width: '100%' }}
        type="text"
        id="name"
        placeholder="Nickname"
        {...register('nickname')}
      />

      <div className="form__row">
          <Button style={{ width: '50%' }} type="submit">
              Join
          </Button>
          <input
              className="form-input"
              style={{ width: '50%' }}
              type="text"
              id="room"
              placeholder="Room Code"
              {...register('room', { required: true, maxLength: 5 })}
          />
      </div>
      <Button style={{ width: '100%' }} type="reset">
        Go Back
      </Button>
    </form>
  );
};
