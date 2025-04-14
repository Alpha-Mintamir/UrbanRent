import React from 'react';
import { Link } from 'react-router-dom';
import BrokerBadge from './BrokerBadge';
import { useLanguage } from '@/providers/LanguageProvider';

const PlaceCard = ({ place }) => {
  const { _id: placeId, photos, address, title, price, is_broker_listing } = place;
  const { language } = useLanguage();
  return (
    <Link to={`/place/${placeId}`} className="m-4 flex flex-col md:m-2 xl:m-0">
      <div className="card ">
        {photos?.[0] && (
          <img
            src={`${photos?.[0]}`}
            className="h-4/5 w-full rounded-xl object-cover"
          />
        )}
        <div className="flex items-center justify-between">
          <h2 className="truncate font-bold">{address}</h2>
          {is_broker_listing && <BrokerBadge size="sm" />}
        </div>
        <h3 className="truncate text-sm text-gray-500">{title}</h3>
        <div className="mt-1">
          <span className="font-semibold">{price} </span>
          {language === 'am' ? 'ብር' : 'ETB'}
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;
