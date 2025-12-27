import { createContext } from 'react';

type AvatarPickerContextProps = {
  showAvatarPicker: boolean;
  setShowAvatarPicker: (data: boolean) => void;
};

export const AvatarPickerContext = createContext<AvatarPickerContextProps>({
  showAvatarPicker: false,
  setShowAvatarPicker: () => {},
});
