// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Import icons for Edit and Delete

const GroupChat = ({
  groupId,
  Image,
  Name,
  Message,
  Unread,
  onClick,
  onDelete,
  onAdd,
  onModify,
  isAdmin,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Function to delete group
  const deleteGroup = async (groupId) => {
    try {
      console.log("Group deleted:", groupId);
      const response = await axios.delete(`/api/groups/group/delete/${groupId}`);
      console.log("Group deleted:", response.data);
      onDelete(groupId); // Pass the groupId to the delete function
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  // Toggle the visibility of the menu
  const handleMenuToggle = (e) => {
    e.stopPropagation(); // Prevent triggering onClick of parent
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false); // Close the menu if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function for Modify button
  const handleModifyClick = () => {
    onModify(groupId); // Pass the groupId to the modify function
    setIsMenuOpen(false); // Close the menu after modifying
  };

    // Function for Add Member button (Can be customized with actual functionality)
    const handleAddMemberClick = () => {
      if (onAdd) {
        onAdd(groupId); // Pass groupId to onAdd function
      }
      setIsMenuOpen(false); // Close the menu after adding member
    };

    
  return (
    <div
      className="flex items-center border-b-[1px] border-black/10 py-3 cursor-pointer bg-white/10"
      onClick={onClick}
    >
      <img src={Image} alt={Name} className="w-[40px] h-[40px] rounded-full" />
      <div className="flex flex-1 flex-col ml-3">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-[14px]">{Name}</p>
          <div className="relative">
            <button
              onClick={handleMenuToggle}
              className="text-[rgb(35,255,159)] bg-[#fefefe] opacity-100 font-semibold text-[16px] focus:outline-none  hover:bg-green-100"
            >
              &#x22EE; {/* Three vertical dots */}
            </button>
            {isAdmin && isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-auto bg-white border border-gray-300 rounded  shadow-lg z-10"
              >
                {/* Edit Button */}
                <button
                  onClick={handleModifyClick}
                  className="flex items-center text-left px-2 py-2 text-[10px] font-light text-black bg-white border border-gray-300 rounded-full hover:bg-blue-500 hover:bg-opacity-50 hover:text-black"
                >
                  <FiEdit className="mr-2" /> Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => deleteGroup(groupId)}
                  className="flex items-center text-left px-2 py-2 text-[10px] font-light text-red-500 bg-white border border-gray-300 rounded-full hover:bg-red-500 hover:bg-opacity-30 hover:text-red-600"
                >
                  <FiTrash2 className="mr-2" /> Delete
                </button>

                {/* Add Member Button */}
                <button
                  onClick={handleAddMemberClick}
                  className="flex items-center text-left px-2 py-2  text-[10px] font-light text-blue-500 bg-white border border-gray-300 rounded-full hover:bg-green-500 hover:bg-opacity-30 hover:text-white"
                >
                  <FiEdit className="mr-2" /> Add Member
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-black/70 text-[12px]">{Message}</p>
        {Unread > 0 && (
          <p className="text-red-500 text-[12px]">{Unread} unread messages</p>
        )}
      </div>
    </div>
  );
};

export default GroupChat;
