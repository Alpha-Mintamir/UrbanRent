import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axios';
import Spinner from '@/components/ui/Spinner';
import { useLanguage } from '@/providers/LanguageProvider';
import DashboardCard from '@/components/ui/DashboardCard';

const PropertyOwnerDashboard = () => {
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalReviews: 0,
    unreadMessages: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data
        const { data } = await axiosInstance.get('/user/profile');
        setUserInfo(data);
        
        // Fetch user's properties
        try {
          // Add a timestamp parameter to prevent caching
          const timestamp = new Date().getTime();
          const propertiesResponse = await axiosInstance.get(`/places/user-places?_t=${timestamp}`);
          console.log('User properties:', propertiesResponse.data);
          
          if (Array.isArray(propertiesResponse.data)) {
            // Log each property to help with debugging
            propertiesResponse.data.forEach((property, index) => {
              console.log(`Property ${index + 1}:`, property.property_id, property.property_name);
            });
            
            setStats(prev => ({
              ...prev,
              totalProperties: propertiesResponse.data.length
            }));
          } else {
            console.error('Unexpected response format for properties:', propertiesResponse.data);
            setStats(prev => ({
              ...prev,
              totalProperties: 0
            }));
          }
        } catch (propertyError) {
          console.error('Error fetching properties:', propertyError);
          // Don't fail the entire dashboard if just properties fail
          setStats(prev => ({
            ...prev,
            totalProperties: 0
          }));
        }
        
        // Here you would also fetch reviews and messages counts
        // This is a placeholder for when those APIs are implemented
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Using the imported DashboardCard component

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('propertyOwnerDashboard')}</h1>
          <p className="text-gray-600">{t('welcomeToDashboard')}, {userInfo?.name || (language === 'am' ? 'ንብረት ባለቤት' : 'Property Owner')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <DashboardCard 
            title={t('myProperties')}
            value={stats.totalProperties.toString()}
            description={t('totalProperties')}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
            color="bg-[#D746B7]"
            onClick={() => navigate('/account/places')}
          />
          
          <DashboardCard 
            title={t('reviews')}
            value={stats.totalReviews.toString()}
            description={t('totalReviews')}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            }
            color="bg-[#D746B7]"
            onClick={() => navigate('/account/reviews')}
          />
          
          <DashboardCard 
            title={t('bookings')}
            value="0"
            description={t('totalBookings')}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            color="bg-[#D746B7]"
            onClick={() => navigate('/account/bookings')}
          />
          
          <DashboardCard 
            title={t('messages')}
            value={stats.unreadMessages.toString()}
            description={t('unreadMessages')}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            }
            color="bg-[#D746B7]"
            onClick={() => navigate('/messages')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">{t('quickLinks')}</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/account" className="text-[#D746B7] hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t('myProfile')}
                </Link>
              </li>
              <li>
                <Link to="/account/settings" className="text-[#D746B7] hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t('settings')}
                </Link>
              </li>
              <li>
                <Link to="/account/verify-location" className="text-[#D746B7] hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t('verifyLocation')}
                </Link>
              </li>
              <li>
                <Link to="/account/places" className="text-[#D746B7] hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t('myProperties')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">{t('usefulTips')}</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>{t('qualityPhotos')}</li>
              <li>{t('accurateDescription')}</li>
              <li>{t('quickResponse')}</li>
              <li>{t('competitivePrice')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyOwnerDashboard;
