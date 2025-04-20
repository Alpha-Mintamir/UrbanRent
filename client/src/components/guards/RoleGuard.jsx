import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { toast } from 'react-toastify';

// Role constants
const ROLES = {
  TENANT: 1,
  PROPERTY_OWNER: 2,
  BROKER: 3,
  ADMIN: 4
};

const RoleGuard = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    toast.info('Please login first!');
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // Ensure both are numbers for comparison
  const userRole = parseInt(user.role);
  const requiredRoleNum = parseInt(requiredRole);
  
  if (requiredRoleNum && userRole !== requiredRoleNum) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/" />;
  }

  return children;
};

export default RoleGuard;
