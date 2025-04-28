import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import axiosInstance from '@/utils/axios';
import { useLanguage } from '@/providers/LanguageProvider';

import AccountNav from '@/components/ui/AccountNav';
import Perks from '@/components/ui/Perks';
import PhotosUploader from '@/components/ui/PhotosUploader';
import Spinner from '@/components/ui/Spinner';

// Fallback location data
const FALLBACK_SUB_CITIES = [
  'አዲስ ከተማ', 'አቃቂ ቃሊቲ', 'አራዳ', 'ቦሌ', 'ጉለሌ',
  'ኮልፌ ቀራኒዮ', 'ልደታ', 'ንፋስ ስልክ ላፍቶ', 'ቂርቆስ', 'የካ'
];

const FALLBACK_WOREDAS = {
  'አዲስ ከተማ': Array.from({ length: 14 }, (_, i) => `ወረዳ ${i + 1}`),
  'አቃቂ ቃሊቲ': Array.from({ length: 13 }, (_, i) => `ወረዳ ${i + 1}`),
  'አራዳ': Array.from({ length: 10 }, (_, i) => `ወረዳ ${i + 1}`),
  'ቦሌ': Array.from({ length: 14 }, (_, i) => `ወረዳ ${i + 1}`),
  'ጉለሌ': Array.from({ length: 10 }, (_, i) => `ወረዳ ${i + 1}`),
  'ኮልፌ ቀራኒዮ': Array.from({ length: 15 }, (_, i) => `ወረዳ ${i + 1}`),
  'ልደታ': Array.from({ length: 10 }, (_, i) => `ወረዳ ${i + 1}`),
  'ንፋስ ስልክ ላፍቶ': Array.from({ length: 13 }, (_, i) => `ወረዳ ${i + 1}`),
  'ቂርቆስ': Array.from({ length: 11 }, (_, i) => `ወረዳ ${i + 1}`),
  'የካ': Array.from({ length: 13 }, (_, i) => `ወረዳ ${i + 1}`)
};

// Create kebele lists
const FALLBACK_KEBELES = {};
Object.keys(FALLBACK_WOREDAS).forEach(subCity => {
  FALLBACK_KEBELES[subCity] = {};
  FALLBACK_WOREDAS[subCity].forEach(woreda => {
    let kebeleCount = 20;
    if (['አዲስ ከተማ', 'ቦሌ', 'ኮልፌ ቀራኒዮ'].includes(subCity)) {
      kebeleCount = 24;
    } else if (['አራዳ', 'ጉለሌ', 'ልደታ'].includes(subCity)) {
      kebeleCount = 18;
    } else if (subCity === 'ቂርቆስ') {
      kebeleCount = 15;
    }
    FALLBACK_KEBELES[subCity][woreda] = Array.from({ length: kebeleCount }, (_, i) => `ቀበሌ ${i + 1}`);
  });
});

// Function to get user data from localStorage
const getUserData = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error('Error parsing user data from localStorage:', e);
    }
  }
  return null;
};

const PropertyFormWithLocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useLanguage();
  
  // Determine if we're in broker mode based on the URL path
  const isBrokerMode = location.pathname.startsWith('/broker');
  
  // Form states
  const [redirect, setRedirect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); // 1 = location, 2 = property details
  
  // Location states
  const [locationData, setLocationData] = useState({
    kifleKetema: '',
    wereda: '',
    kebele: '',
    houseNumber: '',
    areaName: '',
  });
  
  // Property states
  const [formData, setFormData] = useState({
    property_name: '',
    description: '',
    extra_info: '',
    max_guests: 4,
    price: 5000,
    perks: [],
  });
  
  // Dropdown options
  const [subCities, setSubCities] = useState(FALLBACK_SUB_CITIES);
  const [woredas, setWoredas] = useState([]);
  const [kebeles, setKebeles] = useState([]);
  
  // Destructure form data
  const {
    property_name,
    description,
    extra_info,
    max_guests,
    price,
    perks,
  } = formData;
  
  // Fetch sub-cities on component mount
  useEffect(() => {
    const fetchSubCities = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/locations/sub-cities');
        if (response.data && response.data.success) {
          const subCitiesData = response.data.subCities || [];
          if (subCitiesData.length > 0) {
            setSubCities(subCitiesData);
          } else {
            setSubCities(FALLBACK_SUB_CITIES);
          }
        } else {
          setSubCities(FALLBACK_SUB_CITIES);
        }
      } catch (error) {
        console.error('Error fetching sub-cities:', error);
        setSubCities(FALLBACK_SUB_CITIES);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubCities();
    
    // If editing, load property data
    if (id) {
      loadPropertyData();
    }
  }, [id]);
  
  // Update woredas when sub-city changes
  useEffect(() => {
    if (!locationData.kifleKetema) {
      setWoredas([]);
      return;
    }
    
    const fetchWoredas = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/locations/woredas/${locationData.kifleKetema}`);
        if (response.data && response.data.success) {
          const woredasData = response.data.woredas || [];
          if (woredasData.length > 0) {
            setWoredas(woredasData);
          } else {
            setWoredas(FALLBACK_WOREDAS[locationData.kifleKetema] || []);
          }
        } else {
          setWoredas(FALLBACK_WOREDAS[locationData.kifleKetema] || []);
        }
      } catch (error) {
        console.error('Error fetching woredas:', error);
        setWoredas(FALLBACK_WOREDAS[locationData.kifleKetema] || []);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWoredas();
    setLocationData(prev => ({ ...prev, wereda: '', kebele: '' }));
  }, [locationData.kifleKetema]);
  
  // Update kebeles when woreda changes
  useEffect(() => {
    if (!locationData.kifleKetema || !locationData.wereda) {
      setKebeles([]);
      return;
    }
    
    const fetchKebeles = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/locations/kebeles/${locationData.kifleKetema}/${locationData.wereda}`);
        if (response.data && response.data.success) {
          const kebelesData = response.data.kebeles || [];
          if (kebelesData.length > 0) {
            setKebeles(kebelesData);
          } else {
            setKebeles(FALLBACK_KEBELES[locationData.kifleKetema]?.[locationData.wereda] || []);
          }
        } else {
          setKebeles(FALLBACK_KEBELES[locationData.kifleKetema]?.[locationData.wereda] || []);
        }
      } catch (error) {
        console.error('Error fetching kebeles:', error);
        setKebeles(FALLBACK_KEBELES[locationData.kifleKetema]?.[locationData.wereda] || []);
      } finally {
        setLoading(false);
      }
    };
    
    fetchKebeles();
    setLocationData(prev => ({ ...prev, kebele: '' }));
  }, [locationData.kifleKetema, locationData.wereda]);
  
  // Load property data for editing
  const loadPropertyData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/places/single-place/${id}`);
      const place = response.data;
      
      // Set property form data
      setFormData({
        property_name: place.property_name || '',
        description: place.description || '',
        extra_info: place.extra_info || '',
        max_guests: place.max_guests || 4,
        price: place.price || 5000,
        perks: place.perks?.map(perk => perk.name) || [],
      });
      
      // Set photos
      if (place.photos && Array.isArray(place.photos)) {
        const photoUrls = place.photos.map(photo => photo.url || photo.photo_url);
        setAddedPhotos(photoUrls);
      }
      
      // Set location data if available
      if (place.location) {
        setLocationData({
          kifleKetema: place.location.sub_city || '',
          wereda: place.location.woreda || '',
          kebele: place.location.kebele || '',
          houseNumber: place.location.house_no || '',
          areaName: place.location.area_name || '',
        });
      }
      
      // Skip to property details step since we're editing
      setCurrentStep(2);
    } catch (error) {
      console.error('Error loading property data:', error);
      toast.error('Failed to load property data');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle location input changes
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle property form input changes
  const handleFormData = (e) => {
    const { name, value, type } = e.target;
    // If the input is not a checkbox, update 'formData' directly
    if (type !== 'checkbox') {
      setFormData({ ...formData, [name]: value });
      return;
    }

    // If type is checkbox (perks)
    if (type === 'checkbox') {
      const currentPerks = [...perks];
      let updatedPerks = [];

      // Check if the perk is already in perks array
      if (currentPerks.includes(name)) {
        updatedPerks = currentPerks.filter((perk) => perk !== name);
      } else {
        updatedPerks = [...currentPerks, name];
      }
      setFormData({ ...formData, perks: updatedPerks });
    }
  };
  
  // Validate location data
  const validateLocationData = () => {
    if (!locationData.kifleKetema) {
      toast.error(language === 'am' ? 'እባክዎ ክፍለ ከተማ ይምረጡ' : 'Please select a sub-city');
      return false;
    }
    
    if (!locationData.wereda) {
      toast.error(language === 'am' ? 'እባክዎ ወረዳ ይምረጡ' : 'Please select a woreda');
      return false;
    }
    
    if (!locationData.kebele) {
      toast.error(language === 'am' ? 'እባክዎ ቀበሌ ይምረጡ' : 'Please select a kebele');
      return false;
    }
    
    if (!locationData.houseNumber) {
      toast.error(language === 'am' ? 'እባክዎ የቤት ቁጥር ያስገቡ' : 'Please enter a house number');
      return false;
    }
    
    if (!locationData.areaName) {
      toast.error(language === 'am' ? 'እባክዎ የአካባቢ ስም ያስገቡ' : 'Please enter an area name');
      return false;
    }
    
    return true;
  };
  
  // Validate property data
  const validatePropertyData = () => {
    if (property_name.trim() === '') {
      toast.error("የንብረት ስም ባዶ መሆን አይችልም!");
      return false;
    } else if (addedPhotos.length < 5) {
      toast.error('ቢያንስ 5 ፎቶዎችን ይጫኑ! የቤቱን የተለያዩ ክፍሎች የሚያሳዩ ምስሎችን ያካትቱ።');
      return false;
    } else if (description.trim() === '') {
      toast.error("ማብራሪያ ባዶ መሆን አይችልም!");
      return false;
    } else if (max_guests < 1) {
      toast.error('ቢያንስ አንድ እንግዳ ያስፈልጋል!');
      return false;
    } else if (max_guests > 20) {
      toast.error("ከፍተኛው የእንግዶች ብዛት ከ 20 መብለጥ አይችልም");
      return false;
    } else if (price < 500) {
      toast.error("ዋጋው ከ 500 ብር በታች መሆን አይችልም");
      return false;
    }
    
    return true;
  };
  
  // Handle next step button
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateLocationData()) {
        // Save location data to localStorage
        localStorage.setItem('locationData', JSON.stringify(locationData));
        setCurrentStep(2);
      }
    }
  };
  
  // Handle back button
  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePropertyData()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Get the current user data
      const currentUser = getUserData();
      
      if (!currentUser || !currentUser.user_id) {
        toast.error('እባክዎ በመጀመሪያ ይገቡ። የተገቢ መረጃ አልተገኘም።');
        console.error('User not authenticated or user ID missing');
        return;
      }
      
      // Prepare data for submission
      const propertyData = {
        property_name,
        description,
        extra_info,
        max_guests: parseInt(max_guests),
        price: parseFloat(price),
        perks,
        photos: addedPhotos,
        user_id: currentUser.user_id,
        location: locationData
      };
      
      console.log('Sending property data with user_id and location_id:', propertyData);
      
      // Send data to the server
      let response;
      if (id) {
        // Update existing property
        response = await axiosInstance.put(`/places/update-place/${id}`, propertyData);
        toast.success('Property updated successfully!');
      } else {
        // Create new property
        response = await axiosInstance.post('/places/add-places', propertyData);
        toast.success('Property added successfully!');
      }
      
      // Redirect to properties page
      navigate(isBrokerMode ? '/broker/places' : '/account/places');
    } catch (error) {
      console.error('Error saving property:', error);
      
      if (error.response) {
        toast.error(error.response.data?.message || 'Failed to save property');
        
        // Log the error details for debugging
        if (error.response.data) {
          console.error('Server error details:', error.response.data);
        }
      } else if (error.request) {
        toast.error('አገልጋዩን ማግኘት አልተቻለም። እባክዎ ኔትወርክዎን ያረጋግጡ።');
      } else {
        toast.error('አስፈላጊው ጥያቄ በመላክ ላይ ችግር ተፈጥሯል።');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function for section headers
  const preInput = (header, description) => {
    return (
      <>
        <h2 className="mt-4 text-2xl">{header}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </>
    );
  };
  
  if (loading && !id) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <AccountNav />
      <h1 className="mb-8 text-center text-3xl font-bold">
        {id ? 'የቤት መረጃ ማስተካከያ' : 'አዲስ ቤት መመዝገቢያ'}
      </h1>
      
      {/* Step indicator */}
      <div className="mx-auto mb-8 flex max-w-4xl justify-between">
        <div className={`flex flex-col items-center ${currentStep === 1 ? 'text-[#D746B7]' : 'text-gray-500'}`}>
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${currentStep === 1 ? 'bg-[#D746B7] text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span className="mt-2">{t('locationInfo')}</span>
        </div>
        <div className="relative flex-1">
          <div className={`absolute top-5 h-1 w-full ${currentStep === 2 ? 'bg-[#D746B7]' : 'bg-gray-200'}`}></div>
        </div>
        <div className={`flex flex-col items-center ${currentStep === 2 ? 'text-[#D746B7]' : 'text-gray-500'}`}>
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${currentStep === 2 ? 'bg-[#D746B7] text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span className="mt-2">{t('propertyDetails')}</span>
        </div>
      </div>
      
      {/* Step 1: Location Information */}
      {currentStep === 1 && (
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-xl font-semibold">{t('locationVerification')}</h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="col-span-1 md:col-span-2">
              <label className="mb-2 block">{t('subCity')}:</label>
              <select
                name="kifleKetema"
                value={locationData.kifleKetema}
                onChange={handleLocationChange}
                className="w-full rounded-md border border-gray-300 p-2"
                disabled={loading}
              >
                <option value="">{t('selectSubCity')}</option>
                {subCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block">{t('woreda')}:</label>
              <select
                name="wereda"
                value={locationData.wereda}
                onChange={handleLocationChange}
                className="w-full rounded-md border border-gray-300 p-2"
                disabled={!locationData.kifleKetema || loading}
              >
                <option value="">{t('selectWoreda')}</option>
                {woredas.map((woreda) => (
                  <option key={woreda} value={woreda}>
                    {woreda}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block">{t('kebele')}:</label>
              <select
                name="kebele"
                value={locationData.kebele}
                onChange={handleLocationChange}
                className="w-full rounded-md border border-gray-300 p-2"
                disabled={!locationData.wereda || loading}
              >
                <option value="">{t('selectKebele')}</option>
                {kebeles.map((kebele) => (
                  <option key={kebele} value={kebele}>
                    {kebele}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block">{t('houseNumber')}:</label>
              <input
                type="text"
                name="houseNumber"
                value={locationData.houseNumber}
                onChange={handleLocationChange}
                placeholder={t('enterHouseNumber')}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div>
              <label className="mb-2 block">{t('areaName')}:</label>
              <input
                type="text"
                name="areaName"
                value={locationData.areaName}
                onChange={handleLocationChange}
                placeholder={t('enterAreaName')}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleNextStep}
              disabled={loading}
              className="rounded-full bg-[#D746B7] px-6 py-3 text-white disabled:bg-gray-400"
            >
              {loading ? 'እየተላከ ነው...' : 'ቀጥል'}
            </button>
          </div>
        </div>
      )}
      
      {/* Step 2: Property Details */}
      {currentStep === 2 && (
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
          {preInput(
            'የቤት አይነት',
            'ቤቱ ምን አይነት እንደሆነ በአጭሩ ይግለጹ (ለምሳሌ: ኮንዶሚኒየም, አፓርትመንት, ቪላ, ወዘተ.)',
          )}
          <input
            type="text"
            name="property_name"
            value={property_name}
            onChange={handleFormData}
            placeholder="የቤት አይነት"
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#D746B7] focus:outline-none"
          />

          {preInput('ምስሎች', 'የቤቱን ገጽታ የሚያሳዩ ምስሎችን ይጫኑ (ቢያንስ 5 ምስሎች - የውጭ እና የውስጥ ክፍሎችን ያካትቱ)')}
          <PhotosUploader
            addedPhotos={addedPhotos}
            setAddedPhotos={setAddedPhotos}
          />

          {preInput('ዝርዝር መግለጫ', 'ስለ ቤቱ ዝርዝር መግለጫ ያስገቡ (ስፋት, ቁጥር ክፍሎች, ወዘተ.)')}
          <textarea
            value={description}
            name="description"
            onChange={handleFormData}
            placeholder="ቤቱን በዝርዝር ይግለጹ..."
            className="min-h-[150px] w-full rounded-lg border border-gray-300 p-2 focus:border-[#D746B7] focus:outline-none"
          />

          {preInput('አገልግሎቶች', 'ቤቱ የሚያቀርባቸው አገልግሎቶች')}
          <Perks selected={perks} handleFormData={handleFormData} />

          {preInput('ተጨማሪ መረጃ', 'ለተከራዮች ማሳወቅ የሚፈልጉት ተጨማሪ መረጃ ካለ')}
          <textarea
            value={extra_info}
            name="extra_info"
            onChange={handleFormData}
            placeholder="ተጨማሪ መረጃ ወይም ልዩ መመሪያዎች..."
            className="min-h-[100px] w-full rounded-lg border border-gray-300 p-2 focus:border-[#D746B7] focus:outline-none"
          />

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              {preInput('ከፍተኛ የእንግዶች ብዛት', 'ቤቱ ሊያስተናግድ የሚችለው ከፍተኛ የሰዎች ብዛት')}
              <input
                type="number"
                name="max_guests"
                value={max_guests}
                onChange={handleFormData}
                min="1"
                max="20"
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#D746B7] focus:outline-none"
              />
            </div>
            
            <div>
              {preInput('ወርሃዊ ዋጋ (ብር)', 'የቤቱ ወርሃዊ የኪራይ ዋጋ በኢትዮጵያ ብር')}
              <input
                type="number"
                name="price"
                value={price}
                onChange={handleFormData}
                min="500"
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#D746B7] focus:outline-none"
              />
            </div>
          </div>
          
          <div className="mt-10 flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-full border border-[#D746B7] bg-white py-3 px-6 text-[#D746B7] transition hover:bg-gray-50"
            >
              ወደኋላ ተመለስ
            </button>
            
            <button 
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#D746B7] py-3 px-20 text-xl font-semibold text-white transition hover:bg-[#c13da3] disabled:bg-gray-400"
            >
              {loading ? 'እየተላከ ነው...' : id ? 'አዘምን' : 'አስቀምጥ'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PropertyFormWithLocation;
