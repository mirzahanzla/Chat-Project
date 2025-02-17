import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";

const AddMember = () => {
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

  // Debounced search handler
  const handleSearch = debounce(async () => {
    if (!searchQuery.trim()) {
      resetSearch(); // Reset search results when query is empty
      return;
    }

    setIsSearching(true);
    setErrorMessage(""); // Clear previous error messages
    resetSearch();

    try {
      if (window.cancelRequest) {
        window.cancelRequest();
      }

      const cancelTokenSource = axios.CancelToken.source();
      window.cancelRequest = cancelTokenSource.cancel;

      const response = await axios.get("/api/users/searchUsersGroup", {
        params: { query: searchQuery },
        cancelToken: cancelTokenSource.token,
      });

      const results = response.data.filter(
        (user) =>
          user._id !== loggedInUserId &&
          !selectedMembers.some((member) => member._id === user._id)
      );

      if (results.length === 0) {
        setErrorMessage("User not found");
      } else {
        setSearchResults(results.slice(0, 4)); // Limit to 4 results
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error("Error searching for users:", error);
        setErrorMessage("Error fetching search results.");
      }
    } finally {
      setIsSearching(false);
    }
  }, 500); // Delay of 500ms

  // Reset search results
  const resetSearch = () => {
    setSearchResults([]); // Clear search results
    setErrorMessage(""); // Clear any error messages
  };

  // Reset the search results when the searchQuery changes
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      resetSearch(); // Reset search when query is empty
    }

    return () => {
      if (window.cancelRequest) {
        window.cancelRequest();
      }
    };
  }, [searchQuery, selectedMembers]);

  // Toggle member selection
  const toggleSelectMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Add selected members to the group
  const handleAddMembers = async () => {
    try {
      const response = await axios.post("/api/groups/addMember", {
        groupId,
        memberIds: selectedMembers,
      });
      if (response.data.success) {
        alert("Members added successfully!");
      } else {
        alert("Failed to add members.");
      }
    } catch (error) {
      console.error("Error adding members:", error);
      alert("Failed to add members.");
    }
  };

  // Cancel and navigate back
  const handleCancel = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Members to Group</h1>

      {/* Search Input */}
      <div className="relative mb-6">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            className="pl-10 mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
            placeholder="Search by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {isSearching && <p>Loading...</p>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>

      {/* Search Results */}
      <div className="relative mt-2 w-full bg-white border border-gray-300 rounded-md z-10 max-h-60 overflow-y-auto">
        {searchResults.length > 0 ? (
          searchResults.map((user) => (
            <motion.div
              key={user._id}
              className={`flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer ${
                selectedMembers.includes(user._id) ? "bg-orange-100" : ""
              }`}
              onClick={() => toggleSelectMember(user._id)}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span>{user.fullName}</span>
              <span
                className={`px-3 py-1 rounded-lg text-xs ${
                  selectedMembers.includes(user._id)
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {selectedMembers.includes(user._id) ? "Selected" : "Select"}
              </span>
            </motion.div>
          ))
        ) : (
          <div className="p-2 text-gray-500">No results found.</div>
        )}
      </div>

      {/* Selected Members */}
      <div className="flex flex-wrap gap-2 mb-6">
        {selectedMembers.map((userId) => {
          const user = searchResults.find((user) => user._id === userId);
          return user ? (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center bg-orange-100 p-2 rounded-lg shadow-md max-h-8"
            >
              <span className="mr-2 text-xs font-light">{user.fullName}</span>
              <button
                className="text-red-500 hover:bg-red-200 rounded-full p-1"
                onClick={() => toggleSelectMember(user._id)}
              >
                &times;
              </button>
            </motion.div>
          ) : null;
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleAddMembers}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all"
        >
          Add Selected Members
        </button>
      </div>
    </div>
  );
};

export default AddMember;
