import React, { useState } from 'react';

const FiltersContact = ({ searchTerm, setSearchTerm, setFilterValue }) => {
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
   
    </div>
  );
};






export default FiltersContact;
