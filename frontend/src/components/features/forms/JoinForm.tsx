import './Form.scss';

import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@components/ui/button/Button.tsx';
import { socket } from '@socket';
import { generateRandomUserName } from '@utils';
import { useToast } from '@hooks/useToast.ts';
import { useRoomJoin } from '@hooks/useRoomJoin.ts';
import { Input } from '@components/ui/input/Input.tsx';

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
    const storageId = localStorage.getItem('id');

    if (socket.id && nickname) {
      socket.emit('join_room', data.room, nickname, storageId);

      setValue('room', '');
    } else {
      toast.error({ message: 'Something went wrong. Please refresh the page or try again!', duration: 3 });
    }
  };

  const handleShowToast = (error: FieldErrors<FormInputs>) => {
    if (error.room) {
      toast.error({ message: error.room.message!, duration: 5 });
    }
  };

  useRoomJoin();

  return (
    <form className="form" onSubmit={handleSubmit(handleJoin, handleShowToast)} onReset={onCancel}>
      <Input style={{ width: '100%' }} type="text" id="name" placeholder="Nickname" register={register('nickname')} />

      <div className="form__row">
        <Button style={{ width: '50%' }} type="submit">
          Join
        </Button>
        <Input
          style={{ width: '50%' }}
          type="text"
          id="room"
          placeholder="Room Code"
          register={register('room', {
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
