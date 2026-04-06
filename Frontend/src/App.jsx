import { Routes, Route, useNavigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/Landing/LandingPage';
import ChatApp from './pages/ChatApp/ChatApp';
import HistoryPage from './pages/History/HistoryPage';
import SavedPage from './pages/Saved/SavedPage';
import SettingsPage from './pages/Settings/SettingsPage';

export default function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<LandingPage onLaunch={() => navigate('/app')} />} />
      <Route element={<MainLayout />}>
        <Route path="/app" element={<ChatApp />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
