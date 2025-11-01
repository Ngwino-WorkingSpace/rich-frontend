import { Navigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';

const ProtectedRoute = ({ children }) => {
  const { account } = useWeb3();
  const userToken = localStorage.getItem('userToken');

  // Check if user is authenticated (has wallet connected and token)
  if (!account || !userToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

