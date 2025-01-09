import React from 'react';

const PerksWidget = ({ perks }) => {
  return (
    <div className="mt-4">
      <hr className="mb-5 border" />
      <p className="text-2xl font-semibold">ስለ ቤቱ ተጨማሪ መረጃ</p>

      <div className="mt-4 grid flex-col gap-4 lg:grid-cols-2 lg:justify-items-stretch lg:gap-4">
        <div className="flex gap-4">
        
          <span className={`${perks?.includes('wifi') ? '' : 'line-through'}`}>
          የመብራት እና የውሀ ገንዘብ ከፋይ
          </span>
        </div>
        <div className="flex gap-4">
         
          <span className={`${perks?.includes('tv') ? '' : 'line-through'}`}>
            #####
          </span>
        </div>
        <div className="flex gap-4">
        
          <span
            className={`${perks?.includes('parking') ? '' : 'line-through'}`}
          >
            የመኪና ፓርኪንግ ቦታ
          </span>
        </div>

        <div className="flex gap-4">
        
          <span className={`${perks?.includes('radio') ? '' : 'line-through'}`}>
          የመኝታ ክፍል ብዛት
          </span>
        </div>
        <div className="flex gap-4">
          
          <span className={`${perks?.includes('pets') ? '' : 'line-through'}`}>
          የኪችን ብዛት
          </span>
        </div>
        <div className="flex gap-4">
          
          <span
            className={`${perks?.includes('enterence') ? '' : 'line-through'}`}
          >
            የሳሎን ብዛት
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerksWidget;
