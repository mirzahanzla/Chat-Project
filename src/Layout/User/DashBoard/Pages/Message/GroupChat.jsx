// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';

const GroupChat = ({
  groupId,
  Image,
  Name,
  isAdmin,
  isFollowing,
  onFollowToggle,
  onClick,
  setShowPopup,
  setGroupIdToUnfollow,
}) => {
  const [buttonHovered, setButtonHovered] = useState(false);

  const handleMouseEnter = () => {
    setButtonHovered(true);
  };

  const handleMouseLeave = () => {
    setButtonHovered(false);
  };

  return (
    <div
      className="flex items-center border-b-[1px] border-black/10 py-3 cursor-pointer bg-white/10"
      onClick={onClick}
    >
      <img src={Image} alt={Name} className="w-[40px] h-[40px] rounded-full" />
      <div className="flex flex-1 flex-col ml-3">
        <p className="font-semibold text-[14px]">{Name}</p>
        {isAdmin && <p className="text-blue-500 text-[12px]">Admin</p>}
      </div>
      <div className="ml-3">
        <button
          className={`px-2 py-1 ${isFollowing ? "bg-yellow-500" : "bg-green-500"} 
                      text-white rounded-full text-xs transition duration-200 flex justify-center items-center font-normal 
                      ${buttonHovered ? 'scale-105' : ''} hover:opacity-90`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering parent onClick
            if (isFollowing) {
              setShowPopup(true);
              setGroupIdToUnfollow(groupId); // Set the group ID for the popup action
            } else {
              onFollowToggle(groupId);
            }
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isFollowing ? "Joined" : "Follow"}
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
