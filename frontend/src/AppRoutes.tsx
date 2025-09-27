import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomePage } from '@components/pages/home/HomePage.tsx';
import { NotFound } from '@components/pages/notFound/NotFound.tsx';
import { UserSettings } from '@components/features/userSettings/UserSettings.tsx';
import { Icon } from '@assets/icon';
import { LobbyPage } from '@components/pages/lobby/LobbyPage.tsx';

export const AppRoutes = () => {
  const [showUserSettings, setShowUserSettings] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room" element={<LobbyPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <motion.div className="user-settings-button" whileHover={{ scale: 1.2, rotate: 180 }} onClick={() => setShowUserSettings(true)}>
        <Icon icon="Settings" />
      </motion.div>
      {showUserSettings && <UserSettings onClose={() => setShowUserSettings(false)} />}
    </BrowserRouter>
  );
};
