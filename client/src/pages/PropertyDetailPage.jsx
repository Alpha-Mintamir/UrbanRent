import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axios';
import AccountNav from '@/components/ui/AccountNav';
import Spinner from '@/components/ui/Spinner';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/places/single-place/${id}`);
        console.log('Fetched property details:', data);
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property details:', error);
        setError('ንብረቱን ማግኘት አልተቻለም። እባክዎ እንደገና ይሞክሩ።');
        toast.error('ንብረቱን ማግኘት አልተቻለም። እባክዎ እንደገና ይሞክሩ።');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

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
          to="/owner/dashboard"
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          ወደ ዳሽቦርድ ተመለስ
        </Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="mb-4 text-xl">ንብረቱ አልተገኘም</div>
        <Link
          to="/owner/dashboard"
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          ወደ ዳሽቦርድ ተመለስ
        </Link>
      </div>
    );
  }

  // Format perks for display
  const formatPerks = (perks) => {
    if (!perks || !Array.isArray(perks) || perks.length === 0) {
      return 'ምንም አገልግሎቶች አልተመዘገቡም';
    }
    
    return perks.map(perk => 
      typeof perk === 'object' ? perk.name : perk
    ).join(', ');
  };

  // Format location data for display
  const formatLocation = (location) => {
    if (!location) return 'ምንም የአድራሻ መረጃ አልተመዘገበም';
    
    return `${location.sub_city || ''}, ${location.woreda || ''}, ${location.kebele || ''}, ${location.area_name || ''}`;
  };

  return (
    <div className="p-4">
      <AccountNav />
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{property.property_name}</h1>
          <button
            onClick={() => navigate(`/account/places/${property.property_id}`)}
            className="rounded-md bg-[#D746B7] px-4 py-2 text-white hover:bg-[#c13da3]"
          >
            አርትዕ
          </button>
        </div>

        {/* Property Images */}
        <div className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">ፎቶዎች</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {property.photos && Array.isArray(property.photos) && property.photos.length > 0 ? (
              property.photos.map((photo, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src={typeof photo === 'object' ? photo.url : photo} 
                    alt={`Property ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Available';
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                ምንም ፎቶዎች አልተጫኑም
              </div>
            )}
          </div>
        </div>

        {/* Property Details */}
        <div className="mb-8 rounded-lg bg-gray-50 p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">የንብረት ዝርዝር</h2>
          
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-gray-700">ዋጋ</h3>
              <p className="text-xl font-bold text-[#D746B7]">ETB {property.price}/ወር</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700">ከፍተኛ የእንግዶች ብዛት</h3>
              <p>{property.max_guests} ሰዎች</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-700">አድራሻ</h3>
            <p>{formatLocation(property.location)}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-700">መግለጫ</h3>
            <p className="whitespace-pre-line">{property.description}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-700">አገልግሎቶች</h3>
            <p>{formatPerks(property.perks)}</p>
          </div>
          
          {property.extra_info && (
            <div>
              <h3 className="font-medium text-gray-700">ተጨማሪ መረጃ</h3>
              <p className="whitespace-pre-line">{property.extra_info}</p>
            </div>
          )}
        </div>

        <div className="mb-8 flex justify-between">
          <Link
            to="/account/places"
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            ወደ ንብረቶች ዝርዝር ተመለስ
          </Link>
          
          <button
            onClick={() => navigate(`/account/places/${property.property_id}`)}
            className="rounded-md bg-[#D746B7] px-4 py-2 text-white hover:bg-[#c13da3]"
          >
            አርትዕ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
