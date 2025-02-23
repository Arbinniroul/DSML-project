import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Camera } from 'lucide-react';

export function AuthPage() {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Get the navigate function
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Effect to determine mode based on the current route
  useEffect(() => {
    if (location.pathname === '/auth/login') {
      setMode('signin');
    } else if (location.pathname === '/auth/register') {
      setMode('signup');
    }
  }, [location.pathname]);

  const handleModeSwitch = () => {
    if (mode === 'signin') {
      setMode('signup');
      navigate('/auth/register'); // Navigate to the Register route
    } else {
      setMode('signin');
      navigate('/auth/login'); // Navigate to the Login route
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4 ">
      <div className="w-full max-w-md"> {/* Use max-w-sm for a narrower container */}
        <div className="bg-card rounded-2xl shadow-xl p-6 ">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground">EmotiSense AI</h1>
            <p className="text-muted-foreground mt-2 text-base">
              {mode === 'signin'
                ? 'Welcome back! Sign in to your account'
                : 'Create your account to get started'}
            </p>
          </div>

          {/* Add the Outlet here to render Login and Register components */}
          <Outlet context={{ mode, setMode }} />

          {/* Switch between Sign In and Sign Up modes button */}
          <div className="text-center mt-4">
            <button
              className="text-blue-600 hover:underline"
              onClick={handleModeSwitch} // Call handleModeSwitch on click
            >
              {mode === 'signin' ? 'Create an account' : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
