import './Form.scss';

import { useForm, SubmitHandler } from 'react-hook-form';
import {Button} from "../../ui/button/Button.tsx";
import {useNavigate} from "react-router-dom";

interface FormInputs {
  nickname: string;
  room: string;
}

type CreateFormProps = {
  onCancel: () => void;
};

export const randomRoomCode = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  while (result.length < 5) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

export const CreateForm = ({ onCancel }: CreateFormProps) => {
  const { register, handleSubmit } = useForm<FormInputs>();

  const navigate = useNavigate();

  const onJoin: SubmitHandler<FormInputs> = (data) => {
    const nickname = data.nickname;
    console.log(nickname);
    navigate('/room');
  };


  return (
    <form
      className="form"
      onSubmit={handleSubmit(onJoin)}
      onReset={onCancel}
    >
      <input
        className="form-input"
        style={{ width: '100%' }}
        type="text"
        id="name"
        placeholder="Nickname"
        {...register('nickname')}
      />

      <Button style={{ width: '100%' }} type="submit">
        Create
      </Button>
      <Button style={{ width: '100%' }} type="reset">
        Go Back
      </Button>
    </form>
  );
};
