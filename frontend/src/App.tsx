import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthPage } from '@/pages/auth';
import { Dashboard } from '@/pages/dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
 // Adjust the import path as needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />}>
          {/* Nested routes for login and register */}
          <Route path="auth/login" element={<Login />} />
          <Route path="auth/register" element={<Register />} />
        </Route>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
