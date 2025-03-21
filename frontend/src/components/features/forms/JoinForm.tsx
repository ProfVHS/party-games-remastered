import './Form.scss';

import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../../ui/button/Button.tsx';
import { socket } from '../../../socket.ts';
import { generateRandomUserName, setSessionVariables } from '../../../utils.ts';
import { useToast } from '../../../hooks/useToast.ts';
import { useRoomJoin } from '../../../hooks/useRoomJoin.ts';

type FormInputs = {
  nickname: string;
  room: string;
};

type JoinFormProps = {
  onCancel: () => void;
};

export const JoinForm = ({ onCancel }: JoinFormProps) => {
  const { register, handleSubmit, setValue } = useForm<FormInputs>();

  const toast = useToast();

  const handleJoin: SubmitHandler<FormInputs> = (data) => {
    const nickname = data.nickname || generateRandomUserName();

    setSessionVariables(data.room, nickname);

    socket.emit('join_room', data.room, nickname);

    setValue('room', '');
  };

  const handleShowToast = (error: FieldErrors<FormInputs>) => {
    if (error.room) {
      toast.error({ message: error.room.message!, duration: 5 });
    }
  };

  useRoomJoin();

  return (
    <form className="form" onSubmit={handleSubmit(handleJoin, handleShowToast)} onReset={onCancel}>
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
          {...register('room', {
            required: 'You have to enter a room code!',
            minLength: { value: 5, message: 'The room code must have 5 characters' },
            maxLength: { value: 5, message: 'The room code must have 5 characters' },
          })}
        />
      </div>
      <Button style={{ width: '100%' }} type="reset">
        Go Back
      </Button>
    </form>
  );
};
