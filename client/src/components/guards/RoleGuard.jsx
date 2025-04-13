import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { toast } from 'react-toastify';

const RoleGuard = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  console.log("RoleGuard - User:", user);
  console.log("RoleGuard - Required Role:", requiredRole);
  console.log("RoleGuard - User Role:", user?.role);
  console.log("RoleGuard - Types:", typeof user?.role, typeof requiredRole);

  if (!user) {
    toast.info('Please login first!');
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // Check if the user has the required role
  // Ensure both are numbers for comparison
  const userRole = parseInt(user.role);
  const requiredRoleNum = parseInt(requiredRole);
  
  console.log("RoleGuard - Parsed Roles:", userRole, requiredRoleNum);
  
  if (requiredRoleNum && userRole !== requiredRoleNum) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/" />;
  }

  return children;
};

export default RoleGuard;
