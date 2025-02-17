// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const BrandProfile = () => {
  const location = useLocation();
  
  const { user } = location.state || {};

  const handleBackClick = () => {
    window.history.back();
  };

  if (!user) {
    return <div className="text-red-500 text-center">No user data available</div>;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [originalUser, setOriginalUser] = useState(user); // Store original user data

  const toggleEdit = () => {
    if (isEditing) {
      setEditedUser(originalUser); // Revert to original data on cancel
    } else {
      setEditedUser(user); // Start editing with current user data
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/user/editProfileData/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: editedUser.fullName,
          age: editedUser.age,
          gender: editedUser.gender,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setEditedUser(updatedUser.user);
      setOriginalUser(updatedUser.user); // Update original user data with new data
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('There was an error updating your profile.');
    }
  };

  const categories = user.category.length > 0 ? JSON.parse(user.category[0]) : [];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h3 className="text-xl font-semibold mb-4">Profile Details</h3>
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.photo}
            alt={`${user.fullName}'s profile`}
            className="rounded-full w-24 h-24 object-cover mb-2"
          />
          <h2 className="text-2xl font-medium">{editedUser.fullName}</h2>
          <p className="text-gray-600">{editedUser.email}</p>
          {isEditing ? (
            <>
              <input
                type="text"
                name="fullName"
                value={editedUser.fullName}
                onChange={handleInputChange}
                className="mt-2 border border-gray-300 rounded-md p-2 w-full"
              />
            
           
            </>
          ) : (
            <>
             
              <p className="text-gray-500">User Type: {user.userType}</p>
            </>
          )}
        </div>

        <div className="mb-4">
         
          <div>
            <label htmlFor="categories" className="block text-gray-700">Categories:</label>
            <div className="mt-1 flex flex-col gap-2">
              {categories.length > 0 ? (
                categories.map((cat, index) => (
                  <p
                    key={index}
                    className='OrangeButtonBorder text-primary text-[9px] sm:text-[12px] lg:text-[11px] xs:text-[10px] cursor-pointer'
                  >
                    {cat}
                  </p>
                ))
              ) : (
                <p className='OrangeButtonBorder text-primary text-[9px] sm:text-[12px] lg:text-[11px] xs:text-[10px] cursor-pointer'>
                  No Categories
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          {isEditing ? (
            <>
              <button
                className="bg-orange-500 text-white rounded-md px-4 py-2 hover:bg-orange-600 transition"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button
                className="bg-gray-300 text-gray-800 rounded-md px-4 py-2 hover:bg-gray-400 transition"
                onClick={toggleEdit}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 transition"
              onClick={toggleEdit}
            >
              Edit
            </button>
          )}
          <button
            className="bg-gray-300 text-gray-800 rounded-md px-4 py-2 hover:bg-gray-400 transition"
            onClick={handleBackClick}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandProfile;