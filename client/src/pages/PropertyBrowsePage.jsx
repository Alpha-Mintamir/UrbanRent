import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axios';
import Spinner from '@/components/ui/Spinner';
import PlaceCard from '@/components/ui/PlaceCard';
import { useLanguage } from '@/providers/LanguageProvider';

const PropertyBrowsePage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    location: '',
    amenities: []
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get('/places');
        console.log('Fetched properties:', data);
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError(language === 'am' ? 'ንብረቶችን ማግኘት አልተቻለም። እባክዎ እንደገና ይሞክሩ።' : 'Could not fetch properties. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [language]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAmenityToggle = (amenity) => {
    if (filters.amenities.includes(amenity)) {
      setFilters({
        ...filters,
        amenities: filters.amenities.filter(a => a !== amenity)
      });
    } else {
      setFilters({
        ...filters,
        amenities: [...filters.amenities, amenity]
      });
    }
  };

  const applyFilters = () => {
    // Apply filters logic here
    // For now, we'll just filter by price and search term
    return properties.filter(property => {
      const matchesPrice = 
        (!filters.priceMin || property.price >= Number(filters.priceMin)) &&
        (!filters.priceMax || property.price <= Number(filters.priceMax));
      
      const matchesSearch = 
        !searchTerm || 
        property.property_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location?.sub_city?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesPrice && matchesSearch;
    });
  };

  const filteredProperties = applyFilters();

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
        <button
          onClick={() => navigate('/tenant/dashboard')}
          className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          {t('returnToDashboard') || 'Return to Dashboard'}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('browseProperties') || 'Browse Properties'}</h1>
          <p className="text-gray-600">{t('findYourDreamHome') || 'Find your dream home from our extensive listings'}</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                {t('search') || 'Search'}
              </label>
              <input
                type="text"
                id="search"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={t('searchPlaceholder') || 'Search by name, description, or location'}
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="w-full md:w-1/4">
              <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700 mb-1">
                {t('minPrice') || 'Min Price (ETB)'}
              </label>
              <input
                type="number"
                id="priceMin"
                name="priceMin"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0"
                value={filters.priceMin}
                onChange={handleFilterChange}
              />
            </div>
            <div className="w-full md:w-1/4">
              <label htmlFor="priceMax" className="block text-sm font-medium text-gray-700 mb-1">
                {t('maxPrice') || 'Max Price (ETB)'}
              </label>
              <input
                type="number"
                id="priceMax"
                name="priceMax"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="100000"
                value={filters.priceMax}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          
          {/* Common amenities filter */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">{t('amenities') || 'Amenities'}</h3>
            <div className="flex flex-wrap gap-2">
              {['WiFi', 'Parking', 'Kitchen', 'TV', 'Air Conditioning'].map(amenity => (
                <button
                  key={amenity}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.amenities.includes(amenity)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  onClick={() => handleAmenityToggle(amenity)}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {filteredProperties.length} {t('propertiesFound') || 'Properties Found'}
            </h2>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                defaultValue="newest"
              >
                <option value="newest">{t('newest') || 'Newest'}</option>
                <option value="priceLow">{t('priceLowToHigh') || 'Price: Low to High'}</option>
                <option value="priceHigh">{t('priceHighToLow') || 'Price: High to Low'}</option>
              </select>
            </div>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.map(property => (
                <PlaceCard key={property.property_id} place={{
                  _id: property.property_id,
                  photos: property.photos?.map(photo => photo.url) || [],
                  address: property.location?.sub_city || 'Unknown Location',
                  title: property.property_name,
                  price: property.price,
                  is_broker_listing: property.is_broker_listing
                }} isTenantView={true} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('noPropertiesFound') || 'No properties found'}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('tryDifferentFilters') || 'Try adjusting your filters or search term to find more properties'}
              </p>
              <button
                onClick={() => {
                  setFilters({
                    priceMin: '',
                    priceMax: '',
                    location: '',
                    amenities: []
                  });
                  setSearchTerm('');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {t('clearFilters') || 'Clear Filters'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyBrowsePage;
