import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthPage } from '@/pages/auth';
import { Dashboard } from '@/pages/dashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={

              <Dashboard />

          }
        />
      </Routes>
    </Router>
  );
}

export default App;