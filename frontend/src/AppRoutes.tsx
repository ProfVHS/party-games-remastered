import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './components/pages/home/HomePage.tsx';
import { NotFound } from './components/pages/notFound/NotFound.tsx';
import { RoomPage } from './components/pages/room/RoomPage.tsx';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
