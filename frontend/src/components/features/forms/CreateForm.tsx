import './Form.scss';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../../ui/button/Button.tsx';
import { socket } from '../../../socket.ts';
import { generateRandomUserName, setSessionVariables } from '../../../utils.ts';
import { useRoomCreate } from '../../../hooks/useRoomCreate.ts';
import { useToast } from '../../../hooks/useToast.ts';
import { Input } from '../../ui/input/Input.tsx';

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
  const toast = useToast();

  const handleCreateRoom: SubmitHandler<FormInputs> = (data) => {
    const randomCode = randomRoomCode();
    const nickname = data.nickname || generateRandomUserName();

    if (socket.id && nickname && randomCode) {
      setSessionVariables(randomCode, socket.id!);

      socket.emit('create_room', randomCode, nickname);
    } else {
      toast.error({ message: 'Something went wrong. Please refresh the page or try again!', duration: 3 });
    }
  };

  useRoomCreate();

  return (
    <form className="form" onSubmit={handleSubmit(handleCreateRoom)} onReset={onCancel}>
      <Input className="form-input" style={{ width: '100%' }} type="text" id="name" placeholder="Nickname" register={register('nickname')} />

      <Button style={{ width: '100%' }} type="submit">
        Create
      </Button>
      <Button style={{ width: '100%' }} type="reset">
        Go Back
      </Button>
    </form>
  );
};
