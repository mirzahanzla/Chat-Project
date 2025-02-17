import React, { useState } from 'react';
import axios from 'axios';

const QueryReportModal = ({ Id, isOpen, onClose }) => {
  const [reason, setReason] = useState(''); // State for reason
  const [contractID] = useState(Id); // Keep contractID in the state but don't show it in the UI
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const queryData = {
      contractID, // Include contractID in the submitted data
      reason,
      remarks,
    };

    try {
      setLoading(true);
      setError(null);

      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('Authorization token not found');
      }

      // Send POST request to the backend API using axios with the Authorization header
      const response = await axios.post('/Brand/createQuery', queryData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Handle success response
      console.log('Query created successfully:', response.data);

      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error creating query:', error);
      setError('Failed to submit query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Report Query</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="border rounded w-full py-2 px-3"
              disabled={loading}
            >
              <option value="" disabled>Select a reason</option>
              <option value="contract_cancellation">Cancellation Issue</option>
              <option value="removed_post">Post Deleted</option>
              {/* Add more reasons as needed */}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional"
              className="border rounded w-full py-2 px-3"
              disabled={loading}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QueryReportModal;