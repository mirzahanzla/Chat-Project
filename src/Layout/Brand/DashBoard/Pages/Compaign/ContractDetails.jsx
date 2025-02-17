import React, { useState } from 'react';
import axios from 'axios';

const ContractDetails = ({ details, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState(details);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (field, value) => {
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`/Brand/updateContract/${details.contractID}`, editedDetails, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Adjust the token retrieval method as necessary
        },
      });
  
      // No need to check response.ok with Axios, check response status instead
      if (response.status !== 200) {
        throw new Error('Failed to update contract details');
      }
  
      console.log('Updated contract details:', response.data.contract);
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error('Error saving updated contract details:', error);
      // You can also add error handling to show a notification to the user
    }
  };  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h2 className="text-xl font-semibold text-orange-600 mb-4 flex justify-between items-center">
          Contract Details
          
        </h2>
        {details ? (
          <div className="space-y-4">
            <div className="flex justify-between text-gray-700">
              <span><strong>Budget:</strong></span>
              {isEditing ? (
                <input
                  type="number"
                  value={editedDetails.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  className="border border-gray-300 rounded p-1 focus:border-orange-500 focus:ring-orange-500"
                />
              ) : (
                <span>${editedDetails.budget}</span>
              )}
            </div>
            <div className="flex justify-between text-gray-700">
              <span><strong>Deadline:</strong></span>
              {isEditing ? (
                <input
                  type="date"
                  value={new Date(editedDetails.deadline).toISOString().split('T')[0]} // Format for input
                  onChange={(e) => handleChange('deadline', e.target.value)}
                  className="border border-gray-300 rounded p-1 focus:border-orange-500 focus:ring-orange-500"
                />
              ) : (
                <span>{new Date(editedDetails.deadline).toLocaleDateString()}</span>
              )}
            </div>
            <div className="flex justify-between text-gray-700">
              <span><strong>Number of Posts:</strong></span>
              {isEditing ? (
                <input
                  type="number"
                  value={editedDetails.posts}
                  onChange={(e) => handleChange('posts', e.target.value)}
                  className="border border-gray-300 rounded p-1 focus:border-orange-500 focus:ring-orange-500"
                />
              ) : (
                <span>{editedDetails.posts}</span>
              )}
            </div>
            <div className="flex justify-between text-gray-700">
              <span><strong>Revisions:</strong></span>
              {isEditing ? (
                <input
                  type="number"
                  value={editedDetails.revisions}
                  onChange={(e) => handleChange('revisions', e.target.value)}
                  className="border border-gray-300 rounded p-1 focus:border-orange-500 focus:ring-orange-500"
                />
              ) : (
                <span>{editedDetails.revisions}</span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading contract details...</p>
        )}
        
        {isEditing && (
          <div className="mt-4 flex justify-end">
            <button 
              onClick={handleSave} 
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-200 mr-2"
            >
              Save
            </button>
            <button 
              onClick={() => setIsEditing(false)} 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
            >
              Cancel
            </button>
          </div>
        )}

        {!isEditing && (
          <button 
            onClick={onClose} 
            className="mt-6 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-200">
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default ContractDetails;