import React from 'react';

const ProposalDetails = ({ details, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h2 className="text-xl font-semibold text-orange-600 mb-4 flex justify-between items-center">
          Proposal Details
        </h2>
        {details ? (
          <div className="space-y-4">
            <div className="flex justify-between text-gray-700">
              <span><strong>Budget:</strong></span>
              <span>${details.budget}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span><strong>Deadline:</strong></span>
              <span>{new Date(details.deadline).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span><strong>Number of Posts:</strong></span>
              <span>{details.posts}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span><strong>Revisions:</strong></span>
              <span>{details.revisions}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading proposal details...</p>
        )}

        <button 
          onClick={onClose} 
          className="mt-6 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-200">
          Close
        </button>
      </div>
    </div>
  );
};

export default ProposalDetails;