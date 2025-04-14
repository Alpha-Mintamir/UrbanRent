import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axios';
import Spinner from '@/components/ui/Spinner';
import { useLanguage } from '@/providers/LanguageProvider';
import PlaceCard from '@/components/ui/PlaceCard';
import { useAuth } from '@/hooks';

const SavedPropertiesPage = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savedProperties, setSavedProperties] = useState([]);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch the user's saved properties from the backend
        // For now, we'll use placeholder data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Sample data
        const sampleProperties = [
          {
            property_id: 1,
            property_name: 'Modern Apartment in Bole',
            price: 15000,
            location: { sub_city: 'Bole', woreda: '03', kebele: '05' },
            photos: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' }],
            is_broker_listing: true
          },
          {
            property_id: 2,
            property_name: 'Cozy Studio in Kirkos',
            price: 8000,
            location: { sub_city: 'Kirkos', woreda: '07', kebele: '12' },
            photos: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' }],
            is_broker_listing: false
          },
          {
            property_id: 3,
            property_name: 'Spacious Family Home in Arada',
            price: 25000,
            location: { sub_city: 'Arada', woreda: '02', kebele: '08' },
            photos: [{ url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' }],
            is_broker_listing: false
          }
        ];
        
        setSavedProperties(sampleProperties);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching saved properties:', error);
        toast.error(language === 'am' ? 'የተቀመጡ ንብረቶችን ማግኘት አልተቻለም' : 'Could not fetch saved properties');
        setLoading(false);
      }
    };
    
    fetchSavedProperties();
  }, [language]);

  const handleRemoveProperty = async (propertyId) => {
    try {
      // In a real implementation, this would remove the property from the user's saved properties
      // For now, we'll just update the UI
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSavedProperties(prevProperties => 
        prevProperties.filter(property => property.property_id !== propertyId)
      );
      
      toast.success(language === 'am' ? 'ንብረቱ ከተቀመጡት ተወግዷል' : 'Property removed from saved list');
    } catch (error) {
      console.error('Error removing property:', error);
      toast.error(language === 'am' ? 'ንብረቱን ማስወገድ አልተቻለም' : 'Could not remove property');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center pt-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-green-600">{t('savedProperties') || 'Saved Properties'}</h1>
            <p className="text-gray-600">{t('propertiesSaved') || 'Properties you saved for later'}</p>
          </div>
          <Link
            to="/browse"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {t('browseProperties') || 'Browse More Properties'}
          </Link>
        </div>
        
        {savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedProperties.map(property => (
              <div key={property.property_id} className="relative">
                <PlaceCard 
                  place={{
                    _id: property.property_id,
                    photos: property.photos?.map(photo => photo.url) || [],
                    address: property.location?.sub_city || 'Unknown Location',
                    title: property.property_name,
                    price: property.price,
                    is_broker_listing: property.is_broker_listing
                  }} 
                  isTenantView={true} 
                />
                <button
                  onClick={() => handleRemoveProperty(property.property_id)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors"
                  title={language === 'am' ? 'አስወግድ' : 'Remove from saved'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">{language === 'am' ? 'ምንም የተቀመጡ ንብረቶች የሉም' : 'No saved properties yet'}</h2>
            <p className="text-gray-600 mb-6">
              {language === 'am' 
                ? 'ንብረቶችን እየተመለከቱ ሲሆኑ፣ የሚወዷቸውን ለመቀመጥ የልብ አዝራሩን ይጫኑ።' 
                : 'While browsing properties, click the heart button to save properties you like.'}
            </p>
            <Link
              to="/browse"
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {language === 'am' ? 'ንብረቶችን ማሰስ ይጀምሩ' : 'Start Browsing Properties'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPropertiesPage;
