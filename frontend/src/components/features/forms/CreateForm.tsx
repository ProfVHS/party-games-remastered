import './Form.scss';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../../ui/button/Button.tsx';
import { socket } from '../../../socket.ts';
import { useJoinRoom } from '../../../hooks/useJoinRoom.ts';

interface FormInputs {
  nickname: string;
  room: string;
}

type CreateFormProps = {
  onCancel: () => void;
};
const randomRoomCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  while (result.length < 5) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

export const CreateForm = ({ onCancel }: CreateFormProps) => {
  const { register, handleSubmit } = useForm<FormInputs>();

  const handleCreateRoom: SubmitHandler<FormInputs> = (data) => {
    const randomCode = randomRoomCode();
    const nickname = data.nickname || 'RandomNickname';

    socket.emit('create_room', randomCode, nickname);
  };

  useJoinRoom();

  return (
    <form className="form" onSubmit={handleSubmit(handleCreateRoom)} onReset={onCancel}>
      <input className="form-input" style={{ width: '100%' }} type="text" id="name" placeholder="Nickname" {...register('nickname')} />

      <Button style={{ width: '100%' }} type="submit">
        Create
      </Button>
      <Button style={{ width: '100%' }} type="reset">
        Go Back
      </Button>
    </form>
  );
};
