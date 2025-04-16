import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
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
                <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/index" element={<IndexPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/account" element={<ProfilePage />} />
              
              {/* Property Owner Dashboard */}
              <Route 
                path="/owner/dashboard" 
                element={
                  <RoleGuard requiredRole={2}>
                    <PropertyOwnerDashboard />
                  </RoleGuard>
                } 
              />
              
              {/* Broker Dashboard */}
              <Route 
                path="/broker/dashboard" 
                element={
                  <RoleGuard requiredRole={3}>
                    <BrokerDashboard />
                  </RoleGuard>
                } 
              />
              
              {/* Property Owner Reviews */}
              <Route 
                path="/account/reviews" 
                element={
                  <RoleGuard requiredRole={2}>
                    <ReviewsPage />
                  </RoleGuard>
                } 
              />
              
              {/* Broker Reviews */}
              <Route 
                path="/broker/reviews" 
                element={
                  <RoleGuard requiredRole={3}>
                    <ReviewsPage />
                  </RoleGuard>
                } 
              />
              
              {/* Property Owner Messages */}
              <Route 
                path="/account/messages" 
                element={
                  <RoleGuard requiredRole={2}>
                    <MessagesPage />
                  </RoleGuard>
                } 
              />
              
              {/* Broker Messages */}
              <Route 
                path="/broker/messages" 
                element={
                  <RoleGuard requiredRole={3}>
                    <MessagesPage />
                  </RoleGuard>
                } 
              />
              
              {/* Property Owner Places */}
              <Route path="/account/places" element={<PlacesPage />} />
              <Route path="/account/places/new" element={<PlacesFormPage />} />
              <Route path="/account/places/:id" element={<PlacesFormPage />} />
              
              {/* Broker Places */}
              <Route path="/broker/places" element={<PlacesPage />} />
              <Route path="/broker/places/new" element={<PlacesFormPage />} />
              <Route path="/broker/places/:id" element={<PlacesFormPage />} />
              
              {/* Broker Deals and Clients */}
              <Route 
                path="/broker/deals" 
                element={
                  <RoleGuard requiredRole={3}>
                    <BrokerDashboard />
                  </RoleGuard>
                } 
              />
              <Route 
                path="/broker/clients" 
                element={
                  <RoleGuard requiredRole={3}>
                    <BrokerDashboard />
                  </RoleGuard>
                } 
              />
              
              <Route 
                path="/property/detail/:id" 
                element={
                  <AuthGuard>
                    <PropertyDetailPage />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/place/:id" 
                element={
                  <AuthGuard>
                    <PlacePage />
                  </AuthGuard>
                } 
              />
              <Route path="/account/bookings" element={<BookingsPage />} />
              <Route
                path="/account/bookings/:id"
                element={<SingleBookedPlace />}
              />
              {/* Property Owner Location Verification */}
              <Route
                path="/account/verify-location"
                element={<LocationVerificationPage />}
              />
              
              {/* Broker Location Verification */}
              <Route
                path="/broker/verify-location"
                element={<LocationVerificationPage />}
              />
              <Route
                path="/account/settings"
                element={
                  <AuthGuard>
                    <SettingsPage />
                  </AuthGuard>
                }
              />
              {/* Broker Settings */}
              <Route
                path="/broker/settings"
                element={
                  <AuthGuard>
                    <SettingsPage />
                  </AuthGuard>
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
              <Route 
                path="/browse" 
                element={<PropertyBrowsePage />} 
              />
              <Route 
                path="/property/:id" 
                element={<TenantPropertyDetailPage />} 
              />
              
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
