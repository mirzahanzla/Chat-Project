import { useState, useEffect } from 'react';
import axios from 'axios';

const Saved = () => {
  const [savedUsers, setSavedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false); // Global removal state

  useEffect(() => {
    const fetchNetworkInfluencers = async () => {
      const token = localStorage.getItem('authToken');
      console.log("Token: ", token);
      try {
        const response = await axios.get('/Brand/networkInfluencers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setSavedUsers(response.data.influencers);
      } catch (err) {
        setError('Failed to fetch network influencers.');
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkInfluencers();
  }, []);

  // Remove influencer from the network and update UI after success
  const handleRemoveFromNetwork = async (influencerID, index) => {
    if (!window.confirm('Are you sure you want to remove this user from your network?')) {
      return;
    }

    setIsRemoving(true); // Start the global "removing" state
    setError(null);

    try {
      // Make an API call to remove the influencer from the network
      await axios.put('/Brand/removeFromNetwork', { influencerID }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      alert('Influencer removed from your network!');

      // Only update the UI after the success response from API
      const updatedUsers = savedUsers.filter((_, i) => i !== index);
      setSavedUsers(updatedUsers);

    } catch (err) {
      setError('Failed to remove influencer from network.');
      console.error(err);
    } finally {
      setIsRemoving(false); // End the global "removing" state
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="pt-5 h-screen bg-gray-100">
      <div className="bg-white max-w-4xl mx-auto rounded-2xl p-6 shadow-lg">

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-2xl font-semibold">Saved Users</p>
        </div>

        {/* Display saved users in a grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedUsers.map((user, index) => (
            <div key={user._id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center space-y-4">
              <img
                src={user.photo}
                alt={user.fullName}
                className="w-20 h-20 rounded-full object-cover shadow-md"
              />
              <div className="text-center">
                <p className="text-md font-medium">{user.fullName}</p>
                <p className="text-sm text-gray-500">{user.userName || `@${user.fullName}`}</p>
              </div>
              <button
                className="w-full poppins-regular bg-orange-500 text-white py-2 px-4 rounded-lg flex justify-center mb-3 mx-3 cursor-pointer"
                onClick={() => handleRemoveFromNetwork(user._id, index)}
                disabled={isRemoving} // Global disabling while any user is being removed
              >
                {isRemoving ? 'Removing...' : 'Remove'}
              </button>
            </div>
          ))}
          
        </div>

      </div>
    </div>
  );
};

export default Saved;