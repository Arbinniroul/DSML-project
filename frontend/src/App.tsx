import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Dashboard } from './pages/dashboard';
import { AuthPage } from './pages/auth';
import { RootState } from './store/store';
import { useSelector } from 'react-redux';

// App.tsx (simplified)
// App.tsx (修正)
function App() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Router>
      <Routes>
        {/* Auth routes (only accessible if NOT logged in) */}
        <Route
          path="/auth"
          element={user ? <Navigate to="/home" replace /> : <AuthPage />}
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Root redirect */}
        <Route
          path="/"
          element={<Navigate to={user ? "/home" : "/auth/login"} replace />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
export default App;