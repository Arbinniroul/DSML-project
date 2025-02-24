// ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store'; // Import your RootState

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// ProtectedRoute.tsx (修正)
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    console.log('ProtectedRoute user:', user);
  }, [user]);
  useEffect(() => {
    if (!user) {
      navigate('/auth/login', { replace: true }); // Use replace to avoid history loop
    }
    setIsLoading(false); // Always set loading to false
  }, [user, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : null;
};
export default ProtectedRoute;