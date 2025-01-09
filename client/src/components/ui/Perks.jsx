import React from 'react';

const Perks = ({ selected, handleFormData }) => {
  return (
    <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
      <label
        className="flex cursor-pointer items-center gap-2 rounded-2xl border p-4"
        key="perks"
      >
        <input
          type="checkbox"
          checked={selected.includes('wifi')}
          name="wifi"
          onChange={handleFormData}
        />
      

        <span>የመብራት እና የውሀ እከፍላለሁከፍላለሁ</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2 rounded-2xl border p-4">
        <input
          type="checkbox"
          checked={selected.includes('parking')}
          name="parking"
          onChange={handleFormData}
        />
 

        <span>መኪና ፓርኪንግ ቦታ</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2 rounded-2xl border p-4">
        <input
          type="checkbox"
          checked={selected.includes('tv')}
          name="tv"
          onChange={handleFormData}
        />

        <span>#####</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2 rounded-2xl border p-4">
        <input
          type="checkbox"
          checked={selected.includes('radio')}
          name="radio"
          onChange={handleFormData}
        />


        <span>#####</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2 rounded-2xl border p-4">
        <input
          type="checkbox"
          checked={selected.includes('pets')}
          name="pets"
          onChange={handleFormData}
        />


        <span>####</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2 rounded-2xl border p-4">
        <input
          type="checkbox"
          checked={selected.includes('enterence')}
          name="enterence"
          onChange={handleFormData}
        />


        <span>#####</span>
      </label>
    </div>
  );
};

export default Perks;
