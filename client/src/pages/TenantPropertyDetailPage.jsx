import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axios';
import Spinner from '@/components/ui/Spinner';
import { useLanguage } from '@/providers/LanguageProvider';
import BrokerBadge from '@/components/ui/BrokerBadge';
import PropertyReviews from '@/components/property/PropertyReviews';
import MessageButton from '@/components/ui/MessageButton';
import { useAuth } from '@/hooks';

const TenantPropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

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

  const handleSaveProperty = async () => {
    try {
      await axiosInstance.post('/saved-properties', { property_id: id });
      toast.success(language === 'am' ? 'ንብረቱ በተሳካ ሁኔታ ተቀምጧል።' : 'Property saved successfully.');
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error(language === 'am' ? 'ንብረቱን ማስቀመጥ አልተቻለም። እባክዎ እንደገና ይሞክሩ።' : 'Could not save property. Please try again.');
    }
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

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Property Details Section */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Title and Location */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
              <p className="mt-2 text-gray-600">
                {property.location?.sub_city}, {property.location?.woreda}
              </p>
            </div>

            {/* Property Images */}
            <div className="mb-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {property.photos?.map((photo, index) => (
                  <div key={index} className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                    <img
                      src={photo}
                      alt={`Property ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Property Description */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">{t('description')}</h2>
              <p className="whitespace-pre-line text-gray-600">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">{t('amenities')}</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.perks?.map((perk, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <PropertyReviews propertyId={id} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-lg bg-white p-6 shadow-lg">
              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary">
                  ETB {property.price}
                </span>
                <span className="text-gray-600">/{t('month')}</span>
              </div>

              {/* Contact Owner/Broker */}
              <div className="space-y-4">
                <MessageButton
                  propertyId={property.property_id}
                  ownerId={property.owner_id}
                  ownerName={property.owner_name}
                />

                <button
                  onClick={handleSaveProperty}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary bg-white py-3 text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {t('saveProperty')}
                </button>
              </div>

              {/* Property Details */}
              <div className="mt-6 border-t pt-6">
                <h3 className="mb-4 text-lg font-semibold">{t('propertyDetails')}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('propertyType')}</span>
                    <span className="font-medium">{property.property_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('maxGuests')}</span>
                    <span className="font-medium">{property.max_guests}</span>
                  </div>
                  {property.broker_id && (
                    <div className="mt-4">
                      <BrokerBadge brokerId={property.broker_id} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantPropertyDetailPage;
