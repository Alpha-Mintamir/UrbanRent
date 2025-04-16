import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axios';
import Spinner from '@/components/ui/Spinner';
import { useLanguage } from '@/providers/LanguageProvider';
import BrokerBadge from '@/components/ui/BrokerBadge';
import PropertyReviews from '@/components/property/PropertyReviews';
import UserRoleDebug from '@/components/debug/UserRoleDebug';
import AuthTest from '@/components/debug/AuthTest';

const TenantPropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/places/single-place/${id}`);
        console.log('Fetched property details:', data);
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property details:', error);
        const errorMessage = language === 'am' ? 'ንብረቱን ማግኘት አልተቻለም። እባክዎ እንደገና ይሞክሩ።' : 'Could not find the property. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id, language]);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({
      ...contactInfo,
      [name]: value
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!contactInfo.name || !contactInfo.email || !contactInfo.message) {
      toast.error(language === 'am' ? 'እባክዎ ሁሉንም አስፈላጊ መስኮች ይሙሉ።' : 'Please fill in all required fields.');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // In a real application, this would send a message to the property owner
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(language === 'am' ? 'መልእክትዎ በተሳካ ሁኔታ ተልኳል።' : 'Your message has been sent successfully.');
      setContactInfo({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(language === 'am' ? 'መልእክትዎን መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።' : 'Could not send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveProperty = async () => {
    try {
      // In a real application, this would save the property to the user's saved properties
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success(language === 'am' ? 'ንብረቱ በተሳካ ሁኔታ ተቀምጧል።' : 'Property saved successfully.');
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error(language === 'am' ? 'ንብረቱን ማስቀመጥ አልተቻለም። እባክዎ እንደገና ይሞክሩ።' : 'Could not save property. Please try again.');
    }
  };

  const handleBookProperty = () => {
    // In a real application, this would navigate to a booking page
    // For now, we'll just show a toast message
    toast.info(language === 'am' ? 'የመያዣ ባህሪ በቅርቡ ይገኛል።' : 'Booking feature coming soon.');
  };

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
          to="/browse"
          className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          {t('backToBrowse') || 'Back to Browse'}
        </Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="mb-4 text-xl">{language === 'am' ? 'ንብረቱ አልተገኘም' : 'Property not found'}</div>
        <Link
          to="/browse"
          className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          {t('backToBrowse') || 'Back to Browse'}
        </Link>
      </div>
    );
  }

  // Format perks for display
  const formatPerks = (perks) => {
    if (!perks || !Array.isArray(perks) || perks.length === 0) {
      return language === 'am' ? 'ምንም አገልግሎቶች አልተመዘገቡም' : 'No amenities registered';
    }
    
    return perks.map(perk => 
      typeof perk === 'object' ? perk.name : perk
    ).join(', ');
  };

  // Get location data for display
  const getLocationData = (location) => {
    if (!location) return null;
    
    // Create an object with location parts that exist
    const locationData = {};
    if (location.sub_city) locationData.subCity = {
      label: language === 'am' ? 'ክፍለ ከተማ' : 'Sub City',
      value: location.sub_city
    };
    if (location.woreda) locationData.woreda = {
      label: language === 'am' ? 'ወረዳ' : 'Woreda',
      value: location.woreda
    };
    if (location.kebele) locationData.kebele = {
      label: language === 'am' ? 'ቀበለ' : 'Kebele',
      value: location.kebele
    };
    if (location.house_no) locationData.houseNo = {
      label: language === 'am' ? 'የቤት ቁጥር' : 'House No',
      value: location.house_no
    };
    
    return locationData;
  };

  // Extract photos from property
  const photos = property.photos?.map(photo => 
    typeof photo === 'object' ? photo.url : photo
  ) || [];

  // Extract location data
  const locationData = getLocationData(property.location);

  // If showing all photos, render a gallery view
  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black text-white min-h-screen">
        <div className="p-8 grid gap-4">
          <div>
            <h2 className="text-2xl">{property.property_name}</h2>
            <button 
              onClick={() => setShowAllPhotos(false)} 
              className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
              {language === 'am' ? 'ዝጋ' : 'Close photos'}
            </button>
          </div>
          {photos.length > 0 ? (
            <div className="grid gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="flex justify-center">
                  <img src={photo} alt={`Photo ${index + 1}`} className="max-h-[80vh]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-[60vh]">
              <p>{language === 'am' ? 'ምንም ፎቶዎች የሉም' : 'No photos available'}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <Link to="/browse" className="text-green-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            {t('backToBrowse') || 'Back to Browse'}
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{property.property_name}</h1>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600">
                    {locationData?.subCity?.value || ''} 
                    {locationData?.woreda?.value ? `, ${locationData.woreda.value}` : ''}
                  </p>
                  {property.is_broker_listing && <BrokerBadge size="sm" />}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{property.price} ETB</div>
                <p className="text-gray-500 text-sm">{language === 'am' ? 'በወር' : 'per month'}</p>
              </div>
            </div>
            
            {/* Photo gallery */}
            <div className="relative">
              {photos.length > 0 ? (
                <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-2xl overflow-hidden">
                  <div>
                    {photos[0] && (
                      <div className="aspect-square">
                        <img 
                          onClick={() => setShowAllPhotos(true)}
                          className="cursor-pointer object-cover aspect-square w-full h-full" 
                          src={photos[0]} 
                          alt={property.property_name} 
                        />
                      </div>
                    )}
                  </div>
                  <div className="grid">
                    {photos[1] && (
                      <img 
                        onClick={() => setShowAllPhotos(true)}
                        className="cursor-pointer aspect-square object-cover" 
                        src={photos[1]} 
                        alt={property.property_name} 
                      />
                    )}
                    <div className="overflow-hidden">
                      {photos[2] && (
                        <img 
                          onClick={() => setShowAllPhotos(true)}
                          className="cursor-pointer aspect-square object-cover relative top-2" 
                          src={photos[2]} 
                          alt={property.property_name} 
                        />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">{language === 'am' ? 'ምንም ፎቶዎች የሉም' : 'No photos available'}</p>
                </div>
              )}
              {photos.length > 0 && (
                <button 
                  onClick={() => setShowAllPhotos(true)}
                  className="flex gap-1 items-center absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md shadow-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                  </svg>
                  {language === 'am' ? 'ሁሉንም ፎቶዎች ይመልከቱ' : 'Show all photos'}
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Property details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">{language === 'am' ? 'የንብረት ዝርዝሮች' : 'Property Details'}</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">{language === 'am' ? 'መግለጫ' : 'Description'}</h3>
                <p className="text-gray-700">{property.description || (language === 'am' ? 'መግለጫ የለም' : 'No description provided')}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">{language === 'am' ? 'አድራሻ' : 'Location'}</h3>
                  <div className="space-y-1">
                    {locationData && Object.values(locationData).map((item, index) => (
                      <div key={index} className="flex">
                        <span className="font-medium w-24">{item.label}:</span>
                        <span className="text-gray-700">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">{language === 'am' ? 'ዋና ዋና ባህሪያት' : 'Key Features'}</h3>
                  <div className="space-y-1">
                    <div className="flex">
                      <span className="font-medium w-24">{language === 'am' ? 'ዋጋ' : 'Price'}:</span>
                      <span className="text-gray-700">{property.price} ETB {language === 'am' ? 'በወር' : 'per month'}</span>
                    </div>
                    {property.max_guests && (
                      <div className="flex">
                        <span className="font-medium w-24">{language === 'am' ? 'ከፍተኛ እንግዶች' : 'Max Guests'}:</span>
                        <span className="text-gray-700">{property.max_guests}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">{language === 'am' ? 'አገልግሎቶች' : 'Amenities'}</h3>
                <p className="text-gray-700">{formatPerks(property.perks)}</p>
              </div>
              
              {property.extra_info && (
                <div>
                  <h3 className="text-lg font-medium mb-2">{language === 'am' ? 'ተጨማሪ መረጃ' : 'Additional Information'}</h3>
                  <p className="text-gray-700">{property.extra_info}</p>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{language === 'am' ? 'የአካባቢ መረጃ' : 'Neighborhood Information'}</h2>
              <p className="text-gray-700 mb-4">
                {language === 'am' 
                  ? 'ይህ ንብረት በአዲስ አበባ ውስጥ ይገኛል። ለበለጠ መረጃ እባክዎን ከባለቤቱ ጋር ይገናኙ።' 
                  : 'This property is located in Addis Ababa. Please contact the owner for more information about the neighborhood.'}
              </p>
              
              {/* Placeholder for a map */}
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                <p className="text-gray-500">{language === 'am' ? 'ካርታ በቅርቡ ይገኛል' : 'Map coming soon'}</p>
              </div>
            </div>
          </div>
          
          {/* Contact and booking sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">{language === 'am' ? 'ባለቤቱን ያግኙ' : 'Contact Owner'}</h2>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'am' ? 'ስም' : 'Name'} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactInfo.name}
                    onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'am' ? 'ኢሜይል' : 'Email'} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'am' ? 'መልእክት' : 'Message'} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactInfo.message}
                    onChange={handleContactChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {language === 'am' ? 'በመላክ ላይ...' : 'Sending...'}
                    </>
                  ) : (
                    language === 'am' ? 'መልእክት ይላኩ' : 'Send Message'
                  )}
                </button>
              </form>
              
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleSaveProperty}
                  className="w-full py-3 bg-white text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {language === 'am' ? 'ንብረቱን አስቀምጥ' : 'Save Property'}
                </button>
                
                <button
                  onClick={handleBookProperty}
                  className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {language === 'am' ? 'ንብረቱን ይያዙ' : 'Book Property'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Property Reviews Section */}
        {!loading && !error && property && (
          <PropertyReviews propertyId={id} />
        )}
        
        {/* Debug components - remove in production */}
        <UserRoleDebug />
        <AuthTest />
      </div>
    </div>
  );
};

export default TenantPropertyDetailPage;
