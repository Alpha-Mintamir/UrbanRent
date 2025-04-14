import React from 'react';
import { Link } from 'react-router-dom';
import PlaceImg from './PlaceImg';

const InfoCard = ({ place }) => {
  console.log('Place data in InfoCard:', place);
  return (
    <Link
      to={`/property/detail/${place.property_id}`}
      className="my-3 flex cursor-pointer flex-col gap-4 rounded-2xl bg-gray-100 p-4 transition-all hover:bg-gray-300 md:flex-row"
      key={place.property_id}
    >
      <div className="flex w-full shrink-0 bg-gray-300 sm:h-32 sm:w-32 ">
        <PlaceImg place={place} />
      </div>
      <div className="">
        <h2 className="text-lg md:text-xl">{place.property_name}</h2>
        <p className="line-clamp-3 mt-2 text-sm">{place.description}</p>
        <p className="mt-1 font-bold">ETB {place.price}/night</p>
      </div>
    </Link>
  );
};

export default InfoCard;
