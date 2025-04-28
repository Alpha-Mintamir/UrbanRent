import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import axiosInstance from '@/utils/axios';

import AccountNav from '@/components/ui/AccountNav';
import InfoCard from '@/components/ui/InfoCard';
import Spinner from '@/components/ui/Spinner';
import { useLanguage } from '@/providers/LanguageProvider';

const PlacesPage = () => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Determine if we're in broker mode based on the URL path
  const isBrokerMode = location.pathname.startsWith('/broker');

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const { data } = await axiosInstance.get('places/user-places');
        console.log('Fetched places data:', data);
        
        if (Array.isArray(data)) {
          setPlaces(data);
        } else {
          console.error('Unexpected data format:', data);
          setError('Unexpected data format received from server');
        }
      } catch (error) {
        console.error('Error fetching places:', error);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    getPlaces();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="mb-4 text-red-500">{error}</div>
        <Link
          to={isBrokerMode ? "/broker/dashboard" : "/owner/dashboard"}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <AccountNav />
      <div className="text-center ">
        <Link
          className="inline-flex gap-1 rounded-full bg-[#D746B7] px-6 py-2 text-white"
          to={isBrokerMode ? '/broker/property/new' : '/account/property/new'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          {t('addNewProperty')}
        </Link>
      </div>
      <div className="mx-4 mt-4">
        {places.length > 0 ? (
          places.map((place) => <InfoCard place={place} key={place.property_id} />)
        ) : (
          <div className="mt-8 text-center">
            <p className="mb-4 text-xl">{t('noPropertiesFound')}</p>
            <p className="mb-6 text-gray-500">{t('noPropertiesYet')}</p>
            <img 
              src="/placeholder-house.png" 
              alt="No properties" 
              className="mx-auto h-40 w-40 opacity-50"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacesPage;
