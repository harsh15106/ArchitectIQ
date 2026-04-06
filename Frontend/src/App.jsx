import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/Landing/LandingPage';
import ChatApp from './pages/ChatApp/ChatApp';
import HistoryPage from './pages/History/HistoryPage';
import SavedPage from './pages/Saved/SavedPage';
import SettingsPage from './pages/Settings/SettingsPage';
import AuthPage from './pages/Auth/AuthPage';

export default function App() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/app" replace /> : <LandingPage />} 
      />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/app" replace /> : <AuthPage initialMode="login" />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to="/app" replace /> : <AuthPage initialMode="signup" />} 
      />
      
      <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />}>
        <Route path="/app" element={<ChatApp />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/profile" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
