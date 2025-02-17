// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';

const InfluncerMessage = ({ Image, Name, Time, Message, Unread, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`flex items-center border-b-[1px] border-black/10 py-3 cursor-pointer ${
        isHovered ? 'bg-black/10' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick} // Trigger the passed onClick function
    >
      <img src={Image} alt={Name} className="size-[40px] Avatar" />
      <div className="flex flex-1 flex-col ml-3">
        <div className="flex justify-between">
          <p className="poppins-semibold text-[12px]">{Name}</p>
          <p
            className={`text-[11px] ${
              Time === 'Online' ? 'text-green-500' : 'text-black/60'
            }`}
          >
            {Time}
          </p>
        </div>
        <p className="text-green-900/80 font-bold text-[11px] max-w-[8rem] truncate">
  {Message}
</p>


        {Unread > 0 && (
          <p className="text-red-500 text-[10px]">{Unread} unread messages</p>
        )}
      </div>
    </div>
  );
};

// Export the component
export default InfluncerMessage;
