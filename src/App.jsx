import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import ChatbotPage from './pages/ChatbotPage';
import TraCuuPage from './pages/TraCuuPage';
import CapNhatPage from './pages/CapNhatPage';

function App() {
    return (
        <AppShell>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chatbot" element={<ChatbotPage />} />
                <Route path="/tra-cuu" element={<TraCuuPage />} />
                <Route path="/cap-nhat" element={<CapNhatPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AppShell>
    );
}

export default App;
