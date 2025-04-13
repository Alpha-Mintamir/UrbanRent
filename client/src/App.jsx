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
import ReviewsPage from './pages/ReviewsPage';
import MessagesPage from './pages/MessagesPage';
import axiosInstance from './utils/axios';
import { UserProvider } from './providers/UserProvider';
import { PlaceProvider } from './providers/PlaceProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { getItemFromLocalStorage } from './utils';
import NotFoundPage from './pages/NotFoundPage';
import IdentityVerificationPage from './pages/IdentityVerificationPage';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import Home from './pages/Home';

function App() {
  useEffect(() => {
    // set the token on refreshing the website
    axiosInstance.defaults.headers.common['Authorization'] =
      `Bearer ${getItemFromLocalStorage('token')}`;
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
              
              {/* Property Owner Reviews */}
              <Route 
                path="/account/reviews" 
                element={
                  <RoleGuard requiredRole={2}>
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
              
              <Route path="/account/places" element={<PlacesPage />} />
              <Route path="/account/places/new" element={<PlacesFormPage />} />
              <Route path="/account/places/:id" element={<PlacesFormPage />} />
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
              <Route
                path="/account/verify-identity"
                element={<IdentityVerificationPage />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
          <ToastContainer autoClose={2000} transition={Slide} />
        </PlaceProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
