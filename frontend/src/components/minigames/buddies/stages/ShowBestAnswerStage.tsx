import { Answer } from '@components/minigames/buddies/components/Answer.tsx';

export const ShowBestAnswerStage = () => {
  return (
    <>
      <span className="buddies__title">The Best Answer is</span>
      <span className="buddies__nickname">Ultra Mango Guy</span>
      <Answer answer="asdasd" />
    </>
  );
};
