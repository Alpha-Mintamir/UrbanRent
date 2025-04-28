import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axios';
import Spinner from '@/components/ui/Spinner';
import { useLanguage } from '@/providers/LanguageProvider';
import DashboardCard from '@/components/ui/DashboardCard';
import { useAuth } from '@/hooks';

const TenantDashboard = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    savedProperties: 0,
    activeBookings: 0,
    viewedProperties: 0,
    unreadMessages: 0
  });
  
  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        // Fetch user data
        const { data } = await axiosInstance.get('/user/profile');
        setUserInfo(data);
        
        // Here you would fetch tenant-specific data
        // For now, we'll use placeholder data
        setStats({
          savedProperties: Math.floor(Math.random() * 5),
          activeBookings: Math.floor(Math.random() * 3),
          viewedProperties: Math.floor(Math.random() * 10) + 5,
          unreadMessages: Math.floor(Math.random() * 3)
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tenant data:', error);
        setLoading(false);
      }
    };
    
    fetchTenantData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-green-600">{t('tenantDashboard') || 'Tenant Dashboard'}</h1>
          <p className="text-gray-600">{t('welcomeToDashboard')}, {userInfo?.name || t('tenant') || 'Tenant'}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <DashboardCard 
            title={t('savedProperties') || 'Saved Properties'}
            value={stats.savedProperties.toString()}
            description={t('propertiesSaved') || 'Properties you saved'}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
            color="bg-green-600"
            onClick={() => navigate('/tenant/saved')}
          />
          
          <DashboardCard 
            title={t('activeBookings') || 'Active Bookings'}
            value={stats.activeBookings.toString()}
            description={t('currentBookings') || 'Your current bookings'}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            color="bg-green-600"
            onClick={() => navigate('/tenant/bookings')}
          />
          
          <DashboardCard 
            title={t('viewedProperties') || 'Viewed Properties'}
            value={stats.viewedProperties.toString()}
            description={t('recentlyViewed') || 'Recently viewed'}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
            color="bg-green-600"
            onClick={() => navigate('/tenant/viewed')}
          />
          
          <DashboardCard 
            title={t('messages') || 'Messages'}
            value={stats.unreadMessages.toString()}
            description={t('unreadMessages') || 'Unread messages'}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            }
            color="bg-green-600"
            onClick={() => navigate('/tenant/messages')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">{t('quickLinks') || 'Quick Links'}</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/account" className="text-green-600 hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t('myProfile') || 'My Profile'}
                </Link>
              </li>
              <li>
                <Link to="/tenant/settings" className="text-green-600 hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t('settings') || 'Settings'}
                </Link>
              </li>
              <li>
                <Link to="/tenant/bookings" className="text-green-600 hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t('myBookings') || 'My Bookings'}
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-green-600 hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {t('browseProperties') || 'Browse Properties'}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">{t('tenantTips') || 'Tenant Tips'}</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>{t('compareProperties') || 'Compare multiple properties before deciding'}</li>
              <li>{t('checkAmenities') || 'Check all amenities and facilities'}</li>
              <li>{t('readReviews') || 'Read reviews from previous tenants'}</li>
              <li>{t('verifyLocation') || 'Verify the location and surroundings'}</li>
              <li>{t('negotiatePrice') || 'Don\'t hesitate to negotiate the price'}</li>
            </ul>
          </div>
        </div>
        
        {/* Browse Properties Button */}
        <div className="mt-10 flex justify-center mb-10">
          <button
            onClick={() => navigate('/browse')}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {t('browseProperties') || 'Browse Properties'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
