import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthMiddleware = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return children;
};

export const PublicOnlyMiddleware = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};
