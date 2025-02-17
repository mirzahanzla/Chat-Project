import { useEffect, useRef, useState } from "react";
import axios from "axios";
// import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
// import InfluncerMessage from "./InfluencerMessage";
import GroupChat from "./GroupChat";
import Test from "./Test"; // Adjust the path accordingly
import debounce from "lodash.debounce";
// import { Link } from "react-router-dom";

const Message = () => {
  const [ShowMessage, setShowMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [, setFollowedGroups] = useState({});
  const [chats] = useState({});
  const [showPopup, setShowPopup] = useState(false); // Popup state for unfollow
  const [, setIsJoined] = useState(false); // Follow/unfollow status
  const [, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserImage] = useState("");
  const [, setLatestMessages] = useState({});
  const [noMessagesFound] = useState(false);
  const [userStatus, setUserStatus] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null); // Active group ID
  const [groupTitle, setGroupTitle] = useState(""); // Active group title
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [admin, setAdmin] = useState({}); // Active group members
  const [selectedGroupImage, setSelectedGroupImage] = useState(""); // Active group image
  const [groups, setGroups] = useState([]);
  const [, setContacts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const [selectedUserName] = useState(""); // New state to hold the selected user's name
  const [selectedChatId, setSelectedChatId] = useState(null); // Store the selected chat's ID

  // Function to generate chatId based on the sender and receiver IDs
  const generateChatId = (senderId, receiverId) => {
    return [senderId, receiverId].sort().join("-"); // This ensures consistency between users
  };


  // Function to show a browser notification
  const showNotification = (title, options) => {
    if (Notification.permission === "granted") {
      const notification = new Notification(title, options);

      // Optional: Handle click event on the notification
      notification.onclick = () => {
        window.focus(); // Bring the app to focus
      };
    }
  };

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          console.warn("Notification permission not granted.");
        }
      });
    }
  }, []);



  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("http://localhost:3000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    const userId = loggedInUserId;
    if (userId) {
      socketRef.current.emit("join", userId);
      socketRef.current.emit("userOnline", userId); // Notify server of user online status??
    }
    // Remove existing listener
    socketRef.current.off("receiveGroupMessage");
    // Listen for group messages in real time
    socketRef.current.on("receiveGroupMessage", (data) => {
      console.log("Received group message:", data);
      if (socketRef.current && socketRef.current.adapter) {
        socketRef.current.adapter.someFunction();
      }

      if (data.groupId === selectedGroup) {
        // Ensure message is for the selected group
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });
    socketRef.current.on("receiveMessage", async (data) => {
      console.log("Data received:", data);

      // Ensure the message is for the logged-in user
      if (data.receiver !== loggedInUserId) {
        showNotification(`New message from ${data.senderName || "Unknown"}`, {
          body: data.message || "You have a new message.",
          icon: data.senderPhoto || "default-photo-url", // Add an image if available
        });
        console.log("Message received but not intended for this user:", data);
        return;
      }

      const selectedSenderId = selectedChatId
        ? selectedChatId.split("-")[0]
        : null;

      // If the sender is the currently selected contact, add the message to the chat window
      if (data.sender === selectedSenderId) {
        setMessages((prevMessages) => {
          // Check if the message already exists in the chat
          const isMessageAlreadyExist = prevMessages.some(
            (msg) =>
              msg.timestamp === data.timestamp && msg.sender === data.sender
          );

          // If the message is not already in the chat, add it
          if (!isMessageAlreadyExist) {
            return [...prevMessages, data];
          } else {
            return prevMessages;
          }
        });
      }

      console.log("Received message from:", data.sender);

      // Update the latest message for the contact
      setLatestMessages((prevLatestMessages) => ({
        ...prevLatestMessages,
        [data.sender]: data,
      }));

      // Update contacts to move the sender to the top of the list or add a new contact if they are not found
      setContacts((prevContacts) => {
        const existingContactIndex = prevContacts.findIndex(
          (contact) => contact.id === data.sender
        );

        if (existingContactIndex === -1) {
          // fetchContacts();
          // New contact received, add to the list
          const contactData = {
            id: data.sender,
            fullName: data.senderName || "Unknown",
            photo: data.senderPhoto || "default-photo-url",
          };
          return [contactData, ...prevContacts];
        } else {
          // Existing contact, move to the top of the list
          const updatedContacts = [...prevContacts];
          const [contact] = updatedContacts.splice(existingContactIndex, 1);

          // Update contact details in case they were missing initially
          contact.fullName = data.senderName || contact.fullName || "Unknown";
          contact.photo =
            data.senderPhoto || contact.photo || "default-photo-url";

          updatedContacts.unshift(contact);

          return updatedContacts;
        }
      });
    });

    // Listen for online status updates
    socketRef.current.on("userOnline", (userId) => {
      setUserStatus((prevStatus) => ({
        ...prevStatus,
        [userId]: true,
      }));
    });

    socketRef.current.on("userOffline", (userId) => {
      setUserStatus((prevStatus) => ({
        ...prevStatus,
        [userId]: false,
      }));
    });

    socketRef.current.on("statusChange", (statusData) => {
      // Example statusData structure: { userId: 'userId', status: 'online' }
      setUserStatus((prevStatus) => ({
        ...prevStatus,
        [statusData.userId]: statusData.status === "online", // Set status as boolean for easier comparison
      }));
    });

    // Handle connection error
    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Handle disconnection
    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [loggedInUserId, selectedChatId, selectedGroup]);

  const LoadingSpinner = () => (
    <div className="flex justify-center mt-5">
      <div
        style={{
          border: "4px solid #f3f3f3",
          borderRadius: "50%",
          borderTop: "4px solid #3498db",
          width: "30px",
          height: "30px",
          animation: "spin 2s linear infinite",
        }}
      ></div>
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}
      </style>
    </div>
  );

  const [authToken, setAuthToken] = useState(null); // Store the token
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
          setAuthToken(token); // Store the token
        } else {
          console.error("Failed to fetch user:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };
    fetchLoggedInUser();
  }, []);

  const handleSelectGroup = (group) => {
    const groupId = group._id;

    if (!following[groupId]) {
      console.warn("Group is not followed. Selection disabled.");
      return; // Prevent selection if not following
    }

    setSelectedGroup(groupId);
    setGroupTitle(group.title);
    setSelectedGroupMembers(group.members);
    setAdmin(group.admin);
    setSelectedGroupImage(group.photo || "");
    setIsJoined(true);

    setSelectedMember(null);
    setSelectedChatId(groupId); // Set the group as the chat ID to listen for messages

    setShowMessage(true);
    setMessages([]); // Clear messages when a new group is selected

    // // Remove previous listeners to prevent duplicate messages
    // socketRef.current.off("receiveGroupMessageUser");

    // // Listen for messages in the newly joined group
    // socketRef.current.on("receiveGroupMessageUser", (data) => {
    //   if (data.groupId === groupId) {
    //     setMessages((prevMessages) => [...prevMessages, data]);
    //   }
    // });

    // Fetch messages only if it's a new group (not the same one clicked again)
    if (!chats[groupId]) {
      fetchMessagesForGroup(groupId); // Fetch messages for the newly selected group
    } else {
      setMessages(chats[groupId]); // Set the messages from the existing chats state if already fetched
    }
  };

  // useEffect to handle socket events for joining and leaving groups
  useEffect(() => {
    if (selectedGroup) {
      const userId = loggedInUserId;

      // Leave the current group when switching
      if (selectedGroup) {
        socketRef.current.emit("leaveGroup", {
          groupId: selectedGroup,
          userId,
        });
      }

      // Join the new group room
      socketRef.current.emit("joinGroup", { groupId: selectedGroup, userId });
    }
  }, [selectedGroup, loggedInUserId]);

  // Function to fetch messages for a specific group
  const fetchMessagesForGroup = async (groupId) => {
    try {
      const response = await axios.get(`/api/groups/${groupId}/messages`);
      setMessages(response.data.messages || []); // Update messages from the API response
    } catch (error) {
      console.error("Error fetching group messages:", error);
    }
  };

  // useEffect to fetch messages when the group is selected
  useEffect(() => {
    if (selectedGroup) {
      // Only fetch if messages are not already present
      if (!chats[selectedGroup]) {
        fetchMessagesForGroup(selectedGroup);
      }
    } else {
      setMessages([]); // Clear messages if no group is selected
    }
  }, [selectedGroup]);

  const handleSendGroupMessage = () => {
    if (!following[selectedGroup]) {
      alert("You have unfollowed this group and cannot send messages.");
      return;
    }
    if (newMessage.trim()) {
      const messageToSend = {
        text: newMessage,
        sender: loggedInUserId,
        groupId: selectedGroup,
        timestamp: new Date().toISOString(),
      };

      // Emit the message to the server
      // Emit the message to the server
      socketRef.current.emit("sendGroupMessage", messageToSend, (ack) => {
        if (ack?.error) {
          console.error("Error sending message:", ack.error);
          alert(ack.error);
        }
      });
      // Log group and sender info
      console.log("Sending message to group ali saif:", messageToSend);
      console.log("Sending message to group:", selectedGroup);
      console.log("Sender ID:", loggedInUserId);

      // Clear the input field after sending
      setNewMessage("");
    } else {
      console.warn("Cannot send an empty message");
    }
  };
  const handleSearch = debounce(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]); // Clear search results if the query is empty
      setErrorMessage(""); // Clear any error messages
      return;
    }

    setIsSearching(true);

    // Filter groups where the name contains the search query, case-insensitively
    const filteredResults = groups.filter((group) =>
      group.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    // Update searchResults or display "no results" message
    if (filteredResults.length === 0) {
      if (searchQuery.trim().length <= 9) {
        setErrorMessage(`No groups found for "${searchQuery.trim()}"`);
      } else {
        setErrorMessage("No groups match the search criteria"); // Generic error for long queries
      }
    } else {
      setSearchResults(filteredResults); // Display filtered results
      setErrorMessage(""); // Clear error if results are found
    }

    setIsSearching(false);
  }, 500);

  useEffect(() => {
    handleSearch();
  }, [searchQuery]); // Re-run whenever searchQuery changes

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Generate chat ID if not already set
      const chatId =
        selectedChatId || generateChatId(loggedInUserId, selectedMember);

      const messageToSend = {
        text: newMessage,
        sender: loggedInUserId,
        receiver: selectedMember,
        chatId: chatId,
        timestamp: new Date().toISOString(),
      };

      console.log("Sender ID:", loggedInUserId);
      console.log("Receiver ID:", selectedMember);
      console.log("Chat ID:", chatId);
      console.log("Sending Message:", messageToSend);

      try {
        // Emit the message to the server
        socketRef.current.emit("sendMessage", messageToSend);
        setMessages((prevMessages) => [...prevMessages, messageToSend]);

        // Clear the input field
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.warn("Cannot send an empty message");
    }
  };

  // Listen for messages from the server
  useEffect(() => {
    const handleReceiveMessage = () => {};

    // Set up the listener for incoming messages
    socketRef.current.on("receiveMessage", handleReceiveMessage);

    // Cleanup listener when the component is unmounted
    return () => {
      socketRef.current.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  const [groupIdToUnfollow, setGroupIdToUnfollow] = useState(null);

  const fetchLastMessageForChat = async (chatId, userId) => {
    try {
      const response = await axios.get(
        `/api/messages/chat/${chatId}/last-message?userId=${userId}`
      );
      return response.data.message; // Return the latest message
    } catch (error) {
      console.error("Error fetching last message for chat:", error);
      return null;
    }
  };

  // Fetch the latest message when the component mounts or when user changes
  useEffect(() => {
    const fetchMessages = async () => {
      const tempMessages = {}; // Temporary object to store the latest messages for each user
      for (let user of searchResults) {
        const latestMessage = await fetchLastMessageForChat(
          user.chatId,
          user._id
        );
        if (latestMessage) {
          tempMessages[user._id] = latestMessage; // Store the latest message for each user
        }
      }
      setLatestMessages(tempMessages); // Update the state with latest messages
    };

    fetchMessages(); // Call fetchMessages when the component mounts
  }, [searchResults]);

  const [error, setError] = useState(null);

  const [following, setFollowing] = useState({}); // Tracks follow status by groupId

  // Fetch followed groups function (moved outside of useEffect)
  const fetchFollowedGroups = async () => {
    if (!authToken) return; // Don't fetch if no token available

    try {
      const response = await axios.get("/api/groups/follow", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("API Response:", response.data); // Log the full response

      const followedGroups = response.data;
      if (!Array.isArray(followedGroups)) {
        console.error(
          "Expected followedGroups to be an array, but got:",
          followedGroups
        );
        return; // Exit if the response is not an array
      }

      const followingStatus = {};
      followedGroups.forEach((group) => {
        followingStatus[group._id] = true; // Mark as followed
      });
      setFollowing(followingStatus);
    } catch (error) {
      console.error("Error fetching followed groups:", error);
    }
  };

  // Fetch followed groups on component mount or when authToken changes
  useEffect(() => {
    fetchFollowedGroups();
  }, [authToken]); // Dependency on authToken

  const handleFollowToggle = async (groupId) => {
    if (!authToken) return; // Don't proceed if no token is available

    // Optimistically update the UI to show the new follow status immediately
    setFollowing((prevState) => ({
      ...prevState,
      [groupId]: !prevState[groupId], // Toggle the following status
    }));

    try {
      const response = await axios.post(
        "/api/groups/follow",
        { groupId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Use authToken here
          },
        }
      );
      console.log("Response data:", response.data);

      // Handle successful follow/unfollow toggle
      console.log(response.data.message); // This will contain the message from the backend
      alert(response.data.message); // Optionally display the message to the user

      // If the response is successful, update the UI based on the backend response
      if (response.status === 200) {
        const updatedFollowingStatus = response.data.followingStatus; // Assuming the response includes the correct status
        setFollowing((prevState) => ({
          ...prevState,
          [groupId]: updatedFollowingStatus, // Update follow status based on the backend response
        }));
      }

      // Fetch the updated list of followed groups to ensure the UI is consistent
      await fetchFollowedGroups();
    } catch (error) {
      console.error("Error toggling follow status:", error);

      // Revert the optimistic UI update if there's an error
      setFollowing((prevState) => ({
        ...prevState,
        [groupId]: !prevState[groupId], // Revert the status change
      }));

      alert("Error toggling follow status");
    }
  };
  //
  const handleUnfollowGroup = async () => {
    if (!authToken || !groupIdToUnfollow) return;

    try {
      const response = await axios.post(
        "/api/groups/unfollow",
        { groupId: groupIdToUnfollow },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data.message);

      if (response.status === 200) {
        alert(response.data.message);

        // Update the following state
        setFollowing((prevState) => ({
          ...prevState,
          [groupIdToUnfollow]: false,
        }));
      }
    } catch (error) {
      console.error("Error unfollowing the group:", error);
      alert("Failed to unfollow the group. Please try again.");
    } finally {
      setShowPopup(false);
      setGroupIdToUnfollow(null);
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("/api/groups/all");
        console.log("Hanzla Data", response.data);
        const groupsData = response.data;
        setGroups(groupsData);
        // Assuming followed status comes from the user data or API
        const followedGroupsData = {}; // Placeholder for actual followed group data
        groupsData.forEach((group) => {
          followedGroupsData[group._id] = false; // Initialize followed as false
        });
        setFollowedGroups(followedGroupsData);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Unable to fetch groups. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []); // Dependency array is empty, so this should only run once

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-white h-screen text-[9px] xs:text-[10px] sm:text-[13px] md:text-[14px]">
      <div className="sm:grid sm:grid-cols-12 mdm:w-[800px] lg:w-[1000px] mx-auto">
        {/* Left Side - Search Users */}
        <div className="col-span-4 border-r-[1px] pr-2 h-screen ml-2">
          <div className="flex justify-center mt-5 sm:justify-between items-center">
            <div>
              <div className="flex items-center  justify-between w-[250px] sm:w-[180px] mdm:w-[200px] lg:w-[250px] relative">
                <img
                  className="size-[20px] absolute top-3 left-2 cursor-pointer"
                  src="/Svg/SearchIcon.svg"
                  alt="Search"
                  onClick={handleSearch}
                />
                <input
                  className="outline-0 bg-none w-full h-[40px] bg-black/5 rounded-lg pl-9"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                />
              </div>

              {/* Error and Loading Display */}
              {errorMessage && (
                <p className="text-center text-blue-800 mt-4">{errorMessage}</p>
              )}
              {isLoading && <LoadingSpinner />}
            </div>
          </div>

          <div className="mt-5 ml-10 mr-2 relative right-8 w-[300px]">
            <p className="poppins-semibold text-[15px]">Groups</p>
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">
                {errorMessage || "An error occurred"}
              </p>
            ) : searchQuery.trim() && searchResults.length === 0 ? (
              <p>{errorMessage || "No groups found"}</p>
            ) : searchQuery.trim() ? (
              searchResults.map((group) => (
                <div key={group._id} className="cursor-pointer">
                  <GroupChat
                    key={group._id}
                    groupId={group._id}
                    Image={group.photo}
                    Name={group.title}
                    isAdmin={group.isAdmin}
                    isFollowing={following[group._id]}
                    onFollowToggle={() =>
                      handleFollowToggle(group._id, following[group._id])
                    }
                    showPopup={showPopup}
                    setShowPopup={setShowPopup}
                    setGroupIdToUnfollow={setGroupIdToUnfollow}
                    onClick={() => {
                      if (following[group._id]) {
                        handleSelectGroup(group);
                      }
                    }}
                    className={
                      !following[group._id]
                        ? "cursor-not-allowed  hover:bg-gray-200 opacity-50"
                        : ""
                    }
                  />
                </div>
              ))
            ) : groups.length > 0 ? (
              groups.map((group) => (
                <div
                  key={group._id}
                  className="cursor-pointer  hover:bg-gray-200"
                >
                  <GroupChat
                    key={group._id}
                    groupId={group._id}
                    Image={group.photo}
                    Name={group.title}
                    isAdmin={group.isAdmin}
                    isFollowing={following[group._id]}
                    onFollowToggle={() =>
                      handleFollowToggle(group._id, following[group._id])
                    }
                    showPopup={showPopup}
                    setShowPopup={setShowPopup}
                    setGroupIdToUnfollow={setGroupIdToUnfollow}
                    onClick={() => {
                      if (following[group._id]) {
                        handleSelectGroup(group);
                      }
                    }}
                    className={
                      !following[group._id]
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }
                  />
                </div>
              ))
            ) : (
              <p>No groups available</p>
            )}

            {showPopup && (
              <div
                className="absolute bg-white border border-gray-300 rounded shadow-lg p-4 z-20 right-10"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-sm text-black">
                  Are you sure you want to unfollow this group?
                </p>
                <div className="flex mt-2 space-x-2">
                  <button
                    className="px-4  font-normal  py-2 bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white rounded-full text-sm shadow-lg hover:from-red-500 hover:via-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
                    onClick={handleUnfollowGroup}
                  >
                    Exit
                  </button>
                  <button
                    className="px-4 py-2  font-normal  bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 text-black rounded-full text-sm shadow-lg hover:from-gray-300 hover:via-gray-400 hover:to-gray-500 transform hover:scale-105 transition-all duration-300 ease-in-out"
                    onClick={() => setShowPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Chat Area */}
        {/* Right Side - Chat Area */}
        <div className={`col-span-8 ${ShowMessage ? "block" : "hidden"}`}>
          {ShowMessage ? (
            <div className="mx-2 relative">
              {selectedGroup ? (
                // Group Chat Layout
                // Group Chat Layout
                <>
                  <div className="flex text-[9px] sm:text-[10px] mdm:text-[12px]">
                    <div
                      className="flex mr-4 sm:hidden"
                      onClick={() => setShowMessage(false)}
                    >
                      <img src="/Svg/Back.svg" alt="Back" />
                    </div>
                    <img
                      className="size-[40px] Avatar"
                      src={selectedGroupImage}
                      alt={groupTitle}
                    />
                    <div className="flex flex-1 flex-col ml-2">
                      <p className="poppins-semibold">{groupTitle}</p>
                      <p className="text-[10px] text-gray-500 font-bold">
                        Admin: {admin.fullName},{" "}
                        {selectedGroupMembers
                          .slice(0, 6) // Limit to 6 members
                          .map((member) => member.fullName)
                          .join(", ")}
                        {selectedGroupMembers.length > 6 && " ..."}{" "}
                        {/* Show "..." if more than 6 members */}
                      </p>
                    </div>
                  </div>

                  {/* Group Chat messages section */}
                  <Test
                    messages={messages}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    handleSendMessage={handleSendGroupMessage}
                    messagesEndRef={messagesEndRef}
                    loggedInUserId={loggedInUserId}
                    selectedGroupId={selectedGroup}
                  />
                </>
              ) : selectedMember ? (
                // One-on-One Chat Layout
                <>
                  <div className="flex text-[9px] sm:text-[10px] mdm:text-[12px]">
                    <div
                      className="flex mr-4 sm:hidden"
                      onClick={() => setShowMessage(false)}
                    >
                      <img src="/Svg/Back.svg" alt="Back" />
                    </div>
                    <img
                      className="size-[40px] Avatar"
                      src={selectedUserImage || "/path/to/default/image.jpg"}
                      alt={selectedUserName || "Unknown User"}
                    />
                    <div className="flex flex-1 flex-col ml-2">
                      <p className="poppins-semibold">
                        {selectedUserName || "Unknown User"}
                      </p>
                      <p
                        className={`text-[10px] ${
                          userStatus[selectedMember]
                            ? "text-green-500 font-bold"
                            : "text-black/70 font-bold"
                        }`}
                      >
                        {userStatus[selectedMember] ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                  {/* Individual Chat messages section */}
                  {noMessagesFound ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-lg text-red-500 font-semibold">
                        No previous chat history found. Start a new
                        conversation!
                      </p>
                    </div>
                  ) : (
                    <Test
                      messages={messages}
                      newMessage={newMessage}
                      setNewMessage={setNewMessage}
                      handleSendMessage={handleSendMessage}
                      messagesEndRef={messagesEndRef}
                      loggedInUserId={loggedInUserId}
                      selectedMember={selectedMember}
                    />
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-lg text-red-500 font-semibold">
                    Please select a chat or group to view messages.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col p-4">
              <h2 className="text-lg font-bold">Recent Chats</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
