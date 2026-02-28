import './Form.scss';

import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@components/ui/button/Button.tsx';
import { socket } from '@socket';
import { generateRandomNickname, setSessionVariables } from '@utils';
import { useToast } from '@hooks/useToast.ts';
import { Input } from '@components/ui/input/Input.tsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { JOIN_ROOM_STATUS, JoinRoomStatus } from '@shared/types';

type FormInputs = {
  nickname: string;
  room: string;
};

type JoinFormProps = {
  roomCode: string;
  onCancel: () => void;
};

export const JoinForm = ({ roomCode, onCancel }: JoinFormProps) => {
  const { register, handleSubmit, setValue } = useForm<FormInputs>();
  const navigate = useNavigate();
  const toast = useToast();

  const handleJoin: SubmitHandler<FormInputs> = (data) => {
    const nickname = data.nickname || generateRandomNickname();
    const storageId = localStorage.getItem('id');

    if (socket.id && nickname) {
      socket.emit('join_room', data.room, nickname, storageId, (response: JoinRoomStatus) => {
        switch (response) {
          case JOIN_ROOM_STATUS.SUCCESS:
            if (socket.id) {
              setSessionVariables(data.room, socket.id);
              navigate(`/room/${data.room}`);
            }
            break;
          case JOIN_ROOM_STATUS.ROOM_NOT_FOUND: {
            toast.error({ message: 'Room does not exist', duration: 5 });
            break;
          }
          case JOIN_ROOM_STATUS.ROOM_FULL: {
            toast.error({ message: 'Room is full', duration: 5 });
            break;
          }
          case JOIN_ROOM_STATUS.ROOM_IN_GAME: {
            toast.error({ message: 'Room is in game', duration: 5 });
            break;
          }
          case JOIN_ROOM_STATUS.INTERNAL_ERROR: {
            toast.error({ message: 'Internal server error', duration: 5 });
            break;
          }
          default: {
            toast.error({ message: 'Internal server error', duration: 5 });
            break;
          }
        }
      });

      setValue('room', '');
    } else {
      toast.error({ message: 'Something went wrong. Please refresh the page or try again!', duration: 3 });
    }
  };

  const handleShowToast = (error: FieldErrors<FormInputs>) => {
    if (error.room) {
      toast.error({ message: error.room.message!, duration: 5 });
    } else if (error.nickname) {
      toast.error({ message: error.nickname.message!, duration: 5 });
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const clipboardText = e.clipboardData.getData('text');
    const textToPaste = clipboardText.replace(`${window.location.origin}/`, '');
    setValue('room', textToPaste, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  useEffect(() => {
    setValue('room', roomCode);
  }, [roomCode]);

  return (
    <form className="form" onSubmit={handleSubmit(handleJoin, handleShowToast)} onReset={onCancel}>
      <Input
        style={{ width: '100%' }}
        type="text"
        id="name"
        placeholder="Nickname"
        register={register('nickname', {
          maxLength: { value: 20, message: "Nickname can't be longer than 20 characters" },
        })}
      />

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
          onPaste={handlePaste}
        />
      </div>
      <Button style={{ width: '100%' }} type="reset">
        Go Back
      </Button>
    </form>
  );
};
