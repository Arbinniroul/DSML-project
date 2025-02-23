import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token'); // Get the token from sessionStorage

  // If there's no token, redirect to login
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // If there's a token, render the children (the protected route)
  return children;
};

export default ProtectedRoute;
