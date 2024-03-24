import React from 'react';
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const Filter = ({ setSelect, search, setSearch, close, setClose, cuisine }) => {
  const handleClose = () => {
    setClose(!close);
  };

  const arrowIcon = close ? <FaArrowUp /> : <FaArrowDown />;

  return (
    <div className={`flex flex-col justify-around items-center fixed bottom-0 w-[90%] h-[20%] transition-all duration-300 ${close ? 'transform translate-y-[76%]' : ''}`}>
        <button alt='filter' className='self-center top-2 right-10 text-xl bg bg-gradient-to-b from-blue-300/30 to-bgBlue py-2 px-4 rounded' onClick={handleClose}>
          {arrowIcon}
        </button>
      <div className='w-full h-full flex justify-around items-center bg-gradient-to-t from-blue-300/30 to-bgBlue rounded-full border-t-2 border-blue-300'>
        <input
          type='search'
          name='search'
          placeholder='Search for recipe'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='rounded-lg p-1 text-black h-[40%]'
        />
        <select 
          placeholder='Select cuizine'
          onChange={(e) => setSelect(e.target.value)}
          className='rounded-lg p-1 text-black h-[40%] w-[13%]'
        >
          <option value=''>Select cuisine</option>
          {cuisine.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filter;
