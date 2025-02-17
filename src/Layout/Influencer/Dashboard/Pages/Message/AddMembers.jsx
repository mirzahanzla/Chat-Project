import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash/debounce";

const AddMembers = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await axios.get("/auth/getLoggedInUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setLoggedInUserId(response.data._id);
        } else {
          console.error("Failed to fetch user:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };
    fetchLoggedInUser();
  }, []);
  const handleSearch = debounce(async () => {
    // If the search query is empty, reset the results and clear the error message
    if (!searchQuery.trim()) {
      resetSearch();
      return;
    }
  
    setIsSearching(true);
    setErrorMessage("");  // Clear any previous error message
  
    try {
      const response = await axios.get("/api/users/searchUsersGroupMember", {
        params: { query: searchQuery, groupId: groupId }, // Pass groupId along with the query
      });
  
      // Filter out the logged-in user and already selected members
      const results = response.data.filter(
        (user) =>
          user._id !== loggedInUserId && // Exclude logged-in user
          !selectedMembers.some((member) => member._id === user._id) // Exclude already selected members
      );
  
      // If no results are found, set an appropriate error message
      if (results.length === 0) {
        setErrorMessage("No users found.");
      } else {
        // If results are found, reset the error message and set the results
        setErrorMessage("");  // Clear error message if there are results
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      // Set error message if there's an issue with the API request
      setErrorMessage("Error fetching search results.");
    } finally {
      setIsSearching(false);
    }
  }, 500);
  
  const resetSearch = () => {
    setSearchResults([]);
    setErrorMessage("");  // Reset the error message when resetting search results
  };
  
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      resetSearch();  // Reset search and clear error message if query is empty
    }
  }, [searchQuery]);
  
  const addMember = (member) => {
    setSelectedMembers((prev) => [...prev, member]);
    setSearchResults((prev) =>
      prev.filter((user) => user._id !== member._id)
    );
  };

  const removeMember = (memberId) => {
    const removedMember = selectedMembers.find((m) => m._id === memberId);
    if (removedMember) {
      setSearchResults((prev) => [removedMember, ...prev]);
    }
    setSelectedMembers((prev) => prev.filter((member) => member._id !== memberId));
  };

  const handleAddMembers = async () => {
    try {
      await axios.post("/api/groups/addMember", {
        groupId,
        memberIds: selectedMembers.map((member) => member._id),
      });
      alert("Members added successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error adding members:", error);
      alert("Failed to add members.");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Members to Group</h1>

      {/* Search Input */}
      <div className="relative mb-6">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            className="pl-10 px-3 py-2 border border-gray-300 rounded-md w-full"
            placeholder="Search for members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {isSearching && <p>Loading...</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>

      {/* Search Results */}
      <div className="relative max-h-60 overflow-y-auto border border-gray-300 rounded-md mb-4">
        {searchResults.length > 0 ? (
          searchResults.map((user) => (
            <motion.div
              key={user._id}
              className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => addMember(user)}
            >
              <span>{user.fullName}</span>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 p-2">No results</p>
        )}
      </div>

      {/* Selected Members */}
      <div className="flex flex-wrap gap-2 mb-6">
        <AnimatePresence>
          {selectedMembers.map((member) => (
            <motion.div
              key={member._id}
              className="flex items-center bg-orange-100 p-2 rounded-lg shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <span>{member.fullName}</span>
              <button
                onClick={() => removeMember(member._id)}
                className="ml-2 text-red-500 hover:bg-red-200 rounded-full px-2"
              >
                &times;
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <motion.button
          onClick={handleCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-all"
          whileTap={{ scale: 0.95 }}
        >
          Cancel
        </motion.button>
        <motion.button
          onClick={handleAddMembers}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all"
          whileTap={{ scale: 0.95 }}
        >
          Add Members
        </motion.button>
      </div>
    </div>
  );
};

export default AddMembers;
