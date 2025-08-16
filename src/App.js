import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
 import LandingPage from './components/LandingPage'; // if you still need it
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import ContentManagement from './components/ContentManagement';

import Settings from './components/Settings';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
         <Route path="/landing" element={<LandingPage />} /> 
         <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/content" element={<ContentManagement />} />
          <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;