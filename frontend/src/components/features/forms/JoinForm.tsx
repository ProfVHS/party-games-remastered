import './Form.scss';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../../ui/button/Button.tsx';
import { socket } from '../../../socket.ts';
import { useJoinRoom } from '../../../hooks/useJoinRoom.ts';
import { generateRandomUserName, setSessionVariables } from '../../../utils.ts';

type FormInputs = {
  nickname: string;
  room: string;
};

type JoinFormProps = {
  onCancel: () => void;
};

export const JoinForm = ({ onCancel }: JoinFormProps) => {
  const { register, handleSubmit } = useForm<FormInputs>();

  const handleJoin: SubmitHandler<FormInputs> = (data) => {
    const nickname = data.nickname || generateRandomUserName();

    setSessionVariables(data.room, nickname);

    socket.emit('join_room', data.room, nickname);
  };

  useJoinRoom();

  return (
    <form className="form" onSubmit={handleSubmit(handleJoin)} onReset={onCancel}>
      <input className="form-input" style={{ width: '100%' }} type="text" id="name" placeholder="Nickname" {...register('nickname')} />

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
