import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PlaceImg from './PlaceImg';

const InfoCard = ({ place }) => {
  const location = useLocation();
  const isBrokerMode = location.pathname.startsWith('/broker');
  
  return (
    <div className="my-3 rounded-2xl bg-gray-100 p-4 transition-all hover:bg-gray-200">
      <div className="flex flex-col gap-4 md:flex-row">
        <Link
          to={`/property/detail/${place.property_id}`}
          className="flex w-full shrink-0 bg-gray-300 sm:h-32 sm:w-32"
        >
          <PlaceImg place={place} />
        </Link>
        <div className="flex-grow">
          <Link to={`/property/detail/${place.property_id}`}>
            <h2 className="text-lg md:text-xl">{place.property_name}</h2>
            <p className="line-clamp-3 mt-2 text-sm">{place.description}</p>
            <p className="mt-1 font-bold">ETB {place.price}/month</p>
          </Link>
          
          <div className="mt-4 flex justify-end gap-2">
            <Link
              to={isBrokerMode ? `/broker/property/edit/${place.property_id}` : `/account/property/edit/${place.property_id}`}
              className="rounded-md bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            >
              Edit
            </Link>
            <Link
              to={`/property/detail/${place.property_id}`}
              className="rounded-md bg-[#D746B7] px-3 py-1 text-white hover:bg-[#c13da3]"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
