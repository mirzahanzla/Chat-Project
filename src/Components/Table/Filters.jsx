import React, { useState } from 'react';

const Filters = ({ searchTerm, setSearchTerm, setFilterValue }) => {
  const handleStatusChange = (value) => {
    setFilterValue(value); // Set the filter value based on the selected option
  };

  return (
    <div className="flex flex-col sm:flex-row  justify-between items-center">

      <div className="relative">
        <input
          value={searchTerm}
          type="text"
          placeholder="Search here"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex w-[200px] sm:w-[300px] rounded-2xl h-8 md:h-10 border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Dropdown for status filtering */}
     <CustomDropdown handleStatusChange={handleStatusChange}/>

    </div>
  );
};



const CustomDropdown = ({ handleStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const options = [
    { value: '', label: 'Show All', bgColor: 'bg-white' },
    { value: 'Pending', label: 'Pending', bgColor: 'bg-white' },
    { value: 'In Review', label: 'In Review', bgColor: 'bg-white' },
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    handleStatusChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative text-center">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex rounded-2xl w-[150px] h-8 md:h-10 border border-input bg-background px-3 py-2 text-sm cursor-pointer"
      >
        <img src="/Svg/Filter.svg" alt="" />
        {selectedOption || 'Select Status'}
      </div>
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20 ">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`flex items-center py-2 px-3 cursor-pointer ${option.bgColor} text-black hover:bg-gray-200  `}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



export default Filters;
