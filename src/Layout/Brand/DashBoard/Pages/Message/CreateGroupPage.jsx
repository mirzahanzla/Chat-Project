import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi"; // Import search icon from react-icons
import debounce from "lodash/debounce";
import axios from "axios";

const CreateGroupPage = () => {
  const [groupTitle, setGroupTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [titleError, setTitleError] = useState("");
  const [memberError, setMemberError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [members, setMembers] = useState([]);
  const [groupPhoto, setGroupPhoto] = useState(null);
  const [groupPhotoPreview, setGroupPhotoPreview] = useState(null);
  const navigate = useNavigate();
  const [hasMoreResults, setHasMoreResults] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const resultsPerPage = 10; // You can change the number of results per page
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
    // If search query is empty, reset the search results and stop the search
    if (!searchQuery.trim()) {
      resetSearch(); // Reset search results
      return;
    }

    setIsSearching(true);
    resetSearch(); // Reset results on each new search

    try {
      // Cancel previous request if there's one ongoing
      if (window.cancelRequest) {
        window.cancelRequest();
      }

      // Create a new cancel token for the current request
      const cancelTokenSource = axios.CancelToken.source();
      window.cancelRequest = cancelTokenSource.cancel;

      // Fetch search results based on the search query
      const response = await axios.get("/api/users/searchUsersGroup", {
        params: { query: searchQuery, page: page, limit: resultsPerPage },
        cancelToken: cancelTokenSource.token,
      });

      // Filter out the logged-in user and already added members from results
      const results = response.data.filter(
        (user) =>
          user._id !== loggedInUserId &&
          !members.some((member) => member._id === user._id)
      );

      // If no results, display "User not found" message
      if (results.length === 0) {
        setErrorMessage("User not found");
        setHasMoreResults(false); // No more results to load
      } else {
        setSearchResults(results);
        setHasMoreResults(true);
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
    setHasMoreResults(true); // Reset pagination when search is cleared
  };

  // Reset the search results whenever the searchQuery or members change
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      resetSearch(); // Reset search when searchQuery is empty
    }

    // Cleanup the cancel token when component unmounts or on searchQuery change
    return () => {
      if (window.cancelRequest) {
        window.cancelRequest();
      }
    };
  }, [searchQuery, members]); // Trigger search when searchQuery or members change

  // Add member to the list
  const addMember = (member) => {
    if (members.length < 3 && !members.some((m) => m._id === member._id)) {
      setMembers((prevMembers) => [...prevMembers, member]);
      resetSearch();
      setSearchQuery("");
      setMemberError("");
    } else if (members.length >= 3) {
      setMemberError("You can add up to 3 members only.");
    }
  };

  const removeMember = (memberId) => {
    setMembers((prevMembers) => {
      const updatedMembers = prevMembers.filter(
        (member) => member._id !== memberId
      );
      // Check if after removal, there are fewer than 3 members
      if (updatedMembers.length < 3) {
        setMemberError("");
      }
      return updatedMembers;
    });
  };

  const handlePhotoDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setGroupPhoto(file);
      setGroupPhotoPreview(URL.createObjectURL(file));
    }
  };
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreResults = () => {
    if (!isLoadingMore && hasMoreResults) {
      setIsLoadingMore(true);
      setPage((prevPage) => prevPage + 1); // Increment the page number
    }
  };

  const handleCreateGroup = async () => {
    // Group Title Validation
    if (!groupTitle.trim()) {
      setTitleError("Group title is required.");
      return;
    } else if (groupTitle.length < 8) {
      setTitleError("Group title must be at least 8 characters.");
      return;
    } else {
      setTitleError("");
    }

    // Member Validation
    if (members.length < 2) {
      setMemberError("At least 2 members are required to create a group.");
      return;
    } else {
      setMemberError("");
    }

    if (!groupPhoto) {
      setErrorMessage("Group photo is required.");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000); // Error message disappears after 5 seconds
      return;
    } else {
      setErrorMessage("");
    }

    try {
      const formData = new FormData();
      formData.append("title", groupTitle);
      formData.append("admin", loggedInUserId);
      formData.append(
        "members",
        JSON.stringify(members.map((member) => member._id))
      );

      // Append group photo if selected
      if (groupPhoto) {
        formData.append("photo", groupPhoto);
      }

      const response = await axios.post("/api/groups/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const groupId = response.data.groupId;
      console.log("Groupid is ", groupId);
      navigate("/message", { state: { newGroupId: groupId } });
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <div className="flex items-top justify-center min-h-screen bg-orange-50">
      {/* Outer container with orange background */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96">
        <h2 className="text-lg font-semibold mb-4 text-orange-600">Create Group</h2>
  
        {/* Group Photo Input */}
        <div
          onDrop={handlePhotoDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex items-center justify-center bg-gray-200 rounded-full w-24 h-24 mx-auto mb-4 relative"
        >
          {groupPhotoPreview ? (
            <img
              src={groupPhotoPreview}
              alt="Group Preview"
              className="rounded-full w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500">Drag & Drop</span>
          )}
        </div>
  
        {/* Group Title Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Group Title</label>
          <input
            type="text"
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
            placeholder="Enter Group Title"
            value={groupTitle}
            onChange={(e) => setGroupTitle(e.target.value)}
          />
          {titleError && <p className="text-red-500 text-sm">{titleError}</p>}
        </div>
  
        {/* Member Search Input */}
        <div className="relative mb-4">
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
  
          {/* Search Results with Infinite Scroll */}
          {searchResults.length > 0 && (
            <div
              className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md z-10 max-h-60 overflow-y-auto"
              onScroll={(e) => {
                const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
                if (bottom && !isLoadingMore && hasMoreResults) {
                  loadMoreResults();
                }
              }}
            >
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => addMember(user)}
                >
                  <span>{user.fullName}</span>
                </div>
              ))}
              {isLoadingMore && <p>Loading more...</p>}
            </div>
          )}
        </div>
  
        {/* Selected Members Display */}
        <div className="flex flex-wrap gap-2 mb-4">
          {members.map((member) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center bg-orange-100 p-1 rounded-lg shadow-md max-h-8"
            >
              <span className="mr-2 text-xs font-light">{member.fullName}</span>
              <button
                className="text-red-500 hover:bg-red-200 rounded-full p-1"
                onClick={() => removeMember(member._id)}
              >
                &times;
              </button>
            </motion.div>
          ))}
        </div>
        {memberError && <p className="text-red-500 text-sm mb-4">{memberError}</p>}
  
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 rounded-md border border-gray-300 text-orange-500 hover:bg-orange-200"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
            onClick={handleCreateGroup}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
  };

export default CreateGroupPage;
