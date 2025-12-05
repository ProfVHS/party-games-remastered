import { useState, ReactNode } from 'react';
import { AvatarPickerContext } from '@context/avatarPicker/AvatarPickerContext';

type AvatarPickerProviderProps = {
  children: ReactNode;
  show?: boolean;
};

export const AvatarPickerProvider = ({ children, show }: AvatarPickerProviderProps) => {
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(show ?? false);

  const value = {
    showAvatarPicker,
    setShowAvatarPicker,
  };

  return <AvatarPickerContext.Provider value={value}>{children}</AvatarPickerContext.Provider>;
};
