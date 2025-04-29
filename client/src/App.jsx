import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/ui/Layout';
import IndexPage from './pages/IndexPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import PlacesPage from './pages/PlacesPage';
import BookingsPage from './pages/BookingsPage';
import PlacesFormPage from './pages/PlacesFormPage';
import PlacePage from './pages/PlacePage';
import SingleBookedPlace from './pages/SingleBookedPlace';
import PropertyOwnerDashboard from './pages/PropertyOwnerDashboard';
import BrokerDashboard from './pages/BrokerDashboard';
import ReviewsPage from './pages/ReviewsPage';
import MessagesPage from './pages/MessagesPage';
import axiosInstance from './utils/axios';
import { UserProvider } from './providers/UserProvider';
import { PlaceProvider } from './providers/PlaceProvider';
import { LanguageProvider } from './providers/LanguageProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { getItemFromLocalStorage } from './utils';
import NotFoundPage from './pages/NotFoundPage';
import LocationVerificationPage from './pages/LocationVerificationPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import SettingsPage from './pages/SettingsPage';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import Home from './pages/Home';
import TenantDashboard from './pages/TenantDashboard';
import PropertyBrowsePage from './pages/PropertyBrowsePage';
import TenantPropertyDetailPage from './pages/TenantPropertyDetailPage';
import SavedPropertiesPage from './pages/SavedPropertiesPage';
import CombinedPropertyPage from './pages/CombinedPropertyPage';
import PropertyFormWithLocation from './pages/PropertyFormWithLocation';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Admin route component that checks if user is admin and redirects accordingly
const AdminRoute = ({ children }) => {
  const adminUser = localStorage.getItem('adminUser');
  
  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }
  
  try {
    const userData = JSON.parse(adminUser);
    if (userData.role !== 4) {
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  } catch (error) {
    localStorage.removeItem('adminUser');
    return <Navigate to="/admin/login" replace />;
  }
};

// Check if user is admin
const isAdmin = () => {
  const adminUser = localStorage.getItem('adminUser');
  if (!adminUser) return false;
  
  try {
    const userData = JSON.parse(adminUser);
    return userData.role === 4;
  } catch (error) {
    return false;
  }
};

// Root route component that redirects based on user role
const RootRoute = () => {
  if (isAdmin()) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Home />;
};

function App() {
  useEffect(() => {
    // set the token on refreshing the website
    const token = getItemFromLocalStorage('token');
    if (token) {
      console.log('Setting token in axios defaults');
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      console.log('No token found in localStorage');
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <LanguageProvider>
          <UserProvider>
            <PlaceProvider>
              <Routes>
                {/* Admin Routes - Outside of Layout */}
                <Route path="/admin">
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="login" element={<AdminLogin />} />
                  <Route 
                    path="dashboard/*" 
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    } 
                  />
                </Route>
                
                {/* Main Layout Routes */}
                <Route path="/" element={<Layout />}>
                  {/* Public Routes */}
                  <Route index element={<RootRoute />} />
                  <Route path="/index" element={<IndexPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/browse" 
                    element={
                      <RoleGuard requiredRole={1}>
                        <PropertyBrowsePage />
                      </RoleGuard>
                    } 
                  />
                  <Route 
                    path="/account" 
                    element={
                      <AuthGuard>
                        <ProfilePage />
                      </AuthGuard>
                    } 
                  />
                  
                  {/* Property Owner Routes */}
                  <Route 
                    path="/owner/dashboard" 
                    element={
                      <RoleGuard requiredRole={2}>
                        <PropertyOwnerDashboard />
                      </RoleGuard>
                    } 
                  />
                  
                  {/* Broker Routes */}
                  <Route 
                    path="/broker/dashboard" 
                    element={
                      <RoleGuard requiredRole={3}>
                        <BrokerDashboard />
                      </RoleGuard>
                    } 
                  />
                  
                  <Route 
                    path="/account/places" 
                    element={
                      <AuthGuard>
                        <PlacesPage />
                      </AuthGuard>
                    } 
                  />
                  <Route 
                    path="/account/places/new" 
                    element={
                      <AuthGuard>
                        <PlacesFormPage />
                      </AuthGuard>
                    } 
                  />
                  <Route 
                    path="/account/places/:id" 
                    element={
                      <AuthGuard>
                        <PlacesFormPage />
                      </AuthGuard>
                    } 
                  />
                  <Route 
                    path="/place/:id" 
                    element={<PlacePage />} 
                  />
                  <Route 
                    path="/property/:id" 
                    element={<PropertyDetailPage />} 
                  />
                  <Route 
                    path="/tenant/property/:id" 
                    element={
                      <RoleGuard requiredRole={1}>
                        <TenantPropertyDetailPage />
                      </RoleGuard>
                    } 
                  />
                  <Route 
                    path="/account/bookings" 
                    element={
                      <AuthGuard>
                        <BookingsPage />
                      </AuthGuard>
                    } 
                  />
                  <Route
                    path="/account/bookings/:id"
                    element={
                      <AuthGuard>
                        <SingleBookedPlace />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/account/verify-location"
                    element={
                      <AuthGuard>
                        <LocationVerificationPage />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/account/settings"
                    element={
                      <AuthGuard>
                        <SettingsPage />
                      </AuthGuard>
                    }
                  />
                  
                  {/* New Combined Property Form with Location */}
                  <Route 
                    path="/account/property/new"
                    element={
                      <AuthGuard>
                        <PropertyFormWithLocation />
                      </AuthGuard>
                    }
                  />
                  <Route 
                    path="/account/property/edit/:id"
                    element={
                      <AuthGuard>
                        <PropertyFormWithLocation />
                      </AuthGuard>
                    }
                  />
                  <Route 
                    path="/broker/property/new"
                    element={
                      <RoleGuard requiredRole={3}>
                        <PropertyFormWithLocation />
                      </RoleGuard>
                    }
                  />
                  <Route 
                    path="/broker/property/edit/:id"
                    element={
                      <RoleGuard requiredRole={3}>
                        <PropertyFormWithLocation />
                      </RoleGuard>
                    }
                  />
                  
                  {/* Tenant Routes */}
                  <Route 
                    path="/tenant/dashboard" 
                    element={
                      <RoleGuard requiredRole={1}>
                        <TenantDashboard />
                      </RoleGuard>
                    } 
                  />
                  <Route 
                    path="/tenant/settings" 
                    element={
                      <AuthGuard>
                        <SettingsPage />
                      </AuthGuard>
                    } 
                  />
                  <Route 
                    path="/tenant/bookings" 
                    element={
                      <RoleGuard requiredRole={1}>
                        <BookingsPage />
                      </RoleGuard>
                    } 
                  />
                  <Route 
                    path="/tenant/messages" 
                    element={
                      <RoleGuard requiredRole={1}>
                        <MessagesPage />
                      </RoleGuard>
                    } 
                  />
                  <Route 
                    path="/tenant/saved" 
                    element={
                      <RoleGuard requiredRole={1}>
                        <SavedPropertiesPage />
                      </RoleGuard>
                    } 
                  />
                  
                  {/* Catch-all Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
              <ToastContainer autoClose={2000} transition={Slide} />
            </PlaceProvider>
          </UserProvider>
        </LanguageProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
