import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import axiosInstance from '@/utils/axios';

import AccountNav from '@/components/ui/AccountNav';
import Perks from '@/components/ui/Perks';
import PhotosUploader from '@/components/ui/PhotosUploader';
import Spinner from '@/components/ui/Spinner';

const PlacesFormPage = () => {
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addedPhotos, setAddedPhotos] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    description: '',
    perks: [],
    extraInfo: '',
    checkIn: '',
    checkOut: '',
    maxGuests: 10,
    price: 500,
  });

  const {
    title,
    address,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = formData;

  const isValidPlaceData = () => {
    if (title.trim() === '') {
      toast.error("Title can't be empty!");
      return false;
    } else if (address.trim() === '') {
      toast.error("Address can't be empty!");
      return false;
    } else if (addedPhotos.length < 5) {
      toast.error('Upload at least 5 photos!');
      return false;
    } else if (description.trim() === '') {
      toast.error("Description can't be empty!");
      return false;
    } else if (maxGuests < 1) {
      toast.error('At least one guests is required!');
      return false;
    } else if (maxGuests > 10) {
      toast.error("Max. guests can't be greater than 10");
      return false;
    }

    return true;
  };

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

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    axiosInstance.get(`/places/${id}`).then((response) => {
      const { place } = response.data;
      // update the state of formData
      for (let key in formData) {
        if (place.hasOwnProperty(key)) {
          setFormData((prev) => ({
            ...prev,
            [key]: place[key],
          }));
        }
      }

      // update photos state separately
      setAddedPhotos([...place.photos]);

      setLoading(false);
    });
  }, [id]);

  const preInput = (header, description) => {
    return (
      <>
        <h2 className="mt-4 text-2xl">{header}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </>
    );
  };

  const savePlace = async (e) => {
    e.preventDefault();

    const formDataIsValid = isValidPlaceData();
    // console.log(isValidPlaceData());
    const placeData = { ...formData, addedPhotos };

    // Make API call only if formData is valid
    if (formDataIsValid) {
      if (id) {
        // update existing place
        const { data } = await axiosInstance.put('/places/update-place', {
          id,
          ...placeData,
        });
      } else {
        // new place
        const { data } = await axiosInstance.post(
          '/places/add-places',
          placeData,
        );
      }
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to={'/account/places'} />;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-4">
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput(
          'ቤቱ አይነት',
          'ቤቶ ምን አይነት እንደሆነ በ አጭሩ ይግለፁ',
        )}
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleFormData}
          
        />

        {preInput('አድራሻ', 'ክፍለ ከተማ፣ ወረዳ እና ቀበሌ')}
        <input
          type="text"
          name="address"
          value={address}
          onChange={handleFormData}
          placeholder="አድራሻ"
        />

        {preInput('ምስል', 'ቤቶን ገፅታ የሚያሳዩ ምስሎችን ያስገቡ')}

        <PhotosUploader
          addedPhotos={addedPhotos}
          setAddedPhotos={setAddedPhotos}
        />

        {preInput('Description', 'ስለ ቤቶ የሚገልፅ አጠር ያለ ማብራሪያ ያስገቡ')}
        <textarea
          value={description}
          name="description"
          onChange={handleFormData}
        />

        {preInput('ስለ ቤቱ ተጨማሪ መረጃ', ' ስለ ቤቱ ተጨማሪ መረጃ ያስገቡ')}
        <Perks selected={perks} handleFormData={handleFormData} />

        {preInput('ስለ ቤቱ ተጨማሪ መረጃ', 'ለተከራይ ምስፈርት ካሎት እዚህ ጋር ያስግቡ')}
        <textarea
          value={extraInfo}
          name="extraInfo"
          onChange={handleFormData}
        />

        {preInput(
          'ዋጋ',
          
        )}
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
        
          <div>
            <h3 className="mt-2 -mb-1"> </h3>
            <input
              type="number"
              name="price"
              value={price}
              onChange={handleFormData}
              placeholder="1"
            />
          </div>
        </div>
        <button className="mx-auto my-4 flex rounded-full bg-[#D746B7] py-3 px-20 text-xl font-semibold text-white">
          Save
        </button>
      </form>
    </div>
  );
};

export default PlacesFormPage;
