import { useEffect, useRef, useState } from "react";
import axios from "axios";
// import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import InfluncerMessage from "./InfluencerMessage";
import GroupChat from "./GroupChat";
import Test from "./Test"; // Adjust the path accordingly
import debounce from "lodash.debounce";
import { Link, useNavigate } from "react-router-dom";

const Message = () => {
  const [ShowMessage, setShowMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [chats, setChats] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]); // Stores all notifications

  const [selectedUserImage, setSelectedUserImage] = useState("");
  const [latestMessages, setLatestMessages] = useState({});
  const [noMessagesFound, setNoMessagesFound] = useState(false);
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const [userStatus, setUserStatus] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null); // Active group ID
  const [groupTitle, setGroupTitle] = useState(""); // Active group title
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [admin, setAdmin] = useState({}); // Active group members
  const [selectedGroupImage, setSelectedGroupImage] = useState(""); // Active group image
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const [selectedUserName, setSelectedUserName] = useState(""); // New state to hold the selected user's name
  const [selectedChatId, setSelectedChatId] = useState(null); // Store the selected chat's ID
  const navigate = useNavigate(); // Declare it at the top level of your component
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
        console.log("Message received but not intended for this user:", data);
        return;
      }


 // Show notification pop-up for the user
 showNotification(`New message from ${data.senderName || "Unknown"}`, {
  body: data.message || "You have a new message.",
  icon: data.senderPhoto || "default-photo-url",
});

// Add notification to state for display in the notification list
setNotifications((prevNotifications) => [
  ...prevNotifications,
  {
    id: data.timestamp, // Unique ID for the notification
    sender: data.sender,
    senderName: data.senderName || "Unknown",
    message: data.message || "You have a new message.",
    timestamp: data.timestamp,
    senderPhoto: data.senderPhoto || "default-photo-url",
  },
]);



      const selectedSenderId = selectedChatId
        ? selectedChatId.split("-")[0]
        : null;

      // If the sender is the currently selected contact, add the message to the chat window
      if (data.sender === selectedSenderId) {
        // showNotification(`New message from ${data.senderName || "Unknown"}`, {
        //   body: data.message || "You have a new message.",
        //   icon: data.senderPhoto || "default-photo-url", // Add an image if available
        // });
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
          fetchContacts();
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

  // 1. Fetch contacts on page load or if logged-in user ID changes
  useEffect(() => {
    if (loggedInUserId) {
      fetchContacts();
    }
  }, [loggedInUserId]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        `/api/messages/messages/contacts/${loggedInUserId}`
      );
      setContacts(response.data);

      // Automatically select the first contact or continue with last selected contact
      if (response.data.length > 0) {
        const initialChatId = selectedChatId || response.data[0].id; // Use last selected or first contact
        setSelectedChatId(initialChatId);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // 2. Fetch messages for the selected chat when contacts load or selected chat changes
  useEffect(() => {
    if (selectedChatId && loggedInUserId) {
      fetchMessagesForChat(selectedChatId, loggedInUserId);
    }
  }, [selectedChatId, loggedInUserId, contacts]); // Run when selectedChatId, loggedInUserId, or contacts update

  // Function to fetch messages for a specific chat
  const fetchMessagesForChat = async (chatId, userId) => {
    if (!chatId || !userId) {
      console.error("fetchMessagesForChat: chatId or userId is undefined");
      return;
    }

    try {
      const response = await axios.get(
        `/api/messages/chat/${chatId}?userId=${userId}`
      );
      if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          console.log("No previous chat history found");
          setMessages([]);
          setChats((prevChats) => ({
            ...prevChats,
            [chatId]: [],
          }));
          setNoMessagesFound(true);
        } else {
          const lastMessage = response.data[response.data.length - 1];
          setMessages(response.data);
          setChats((prevChats) => ({
            ...prevChats,
            [chatId]: response.data,
          }));
          setNoMessagesFound(false);

          // Update the latest message for this chat in the contact list
          setLatestMessages((prevLatestMessages) => ({
            ...prevLatestMessages,
            [chatId]: lastMessage,
          }));
        }
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching messages for chat:", error);
      setNoMessagesFound(true);
    }
  };
  useEffect(() => {
    // Skip fetching if user ID is not available
    if (!loggedInUserId) return;

    const fetchGroups = async () => {
      setIsLoading(true); // Start loading before API call
      try {
        const response = await axios.get(`/api/groups/${loggedInUserId}`);

        // Check if the response contains groups data
        const groupsWithAdminFlag = (response.data.groups || []).map(
          (group) => ({
            ...group,
            isAdmin: group.admin._id === loggedInUserId, // Add isAdmin field
          })
        );

        setGroups(groupsWithAdminFlag); // Set the updated groups data

        console.log("Groups with isAdmin flag:", groupsWithAdminFlag);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setIsLoading(false); // Stop loading after API call
      }
    };

    // Fetch groups only if loggedInUserId has changed
    fetchGroups();
  }, [loggedInUserId]);

  const [alertMessage, setAlertMessage] = useState(null);
  const deleteGroup = async (groupId) => {
    // Remove the group from the state
    setGroups((prevGroups) =>
      prevGroups.filter((group) => group._id !== groupId)
    );

    // Show alert message and save it to localStorage
    const message = "Group deleted successfully!";
    setAlertMessage(message);
    localStorage.setItem("alertMessage", message);

    // Automatically hide the alert after 3 seconds
    setTimeout(() => {
      setAlertMessage(null);
      localStorage.removeItem("alertMessage");
    }, 3000);
  };
  useEffect(() => {
    // Load the alert message from localStorage on component mount
    const storedAlertMessage = localStorage.getItem("alertMessage");
    if (storedAlertMessage) {
      setAlertMessage(storedAlertMessage);

      // Remove the alert message after 3 seconds
      setTimeout(() => {
        setAlertMessage(null);
        localStorage.removeItem("alertMessage");
      }, 3000);
    }
  }, []);

  const handleSelectGroup = (group) => {
    const groupId = group._id;

    // If the group is already selected, prevent refetching messages
    if (groupId === selectedGroup) {
      return; // Don't proceed if the same group is clicked
    }

    setSelectedGroup(groupId);
    setGroupTitle(group.title);
    setSelectedGroupMembers(group.members);
    setAdmin(group.admin);
    setSelectedGroupImage(group.photo || "");

    setSelectedMember(null);
    setSelectedChatId(groupId); // Set the group as the chat ID to listen for messages

    setShowMessage(true);
    setMessages([]); // Clear messages when a new group is selected

   

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
    if (newMessage.trim()) {
      const messageToSend = {
        text: newMessage,
        sender: loggedInUserId,
        groupId: selectedGroup,
        timestamp: new Date().toISOString(),
      };

      // Emit the message to the server
      socketRef.current.emit("sendGroupMessage", messageToSend);

      // Log group and sender info
      console.log("Sending message to group:", selectedGroup);
      console.log("Sender ID:", loggedInUserId);

      // Clear the input field after sending
      setNewMessage("");
    } else {
      console.warn("Cannot send an empty message");
    }
  };
  // Debounced search function to filter contacts
  const handleSearch = debounce(() => {
    // If search query is empty, reset contacts to their original state
    if (!searchQuery.trim()) {
      setSearchResults([]); // Clear search results
      setErrorMessage(""); // Clear any error messages
      return;
    }

    setIsSearching(true);

    // Filter contacts based on searchQuery
    const filteredResults = contacts.filter((contact) =>
      contact.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Update searchResults or display "no results" message
    if (filteredResults.length === 0) {
      setErrorMessage("No contacts found");
    } else {
      setSearchResults(filteredResults); // Update searchResults with filtered results
    }

    setIsSearching(false);
  }, 500); // Adjust debounce delay as needed

  // Trigger handleSearch whenever searchQuery changes
  useEffect(() => {
    handleSearch();
  }, [searchQuery]); // Re-run only if searchQuery changes


  const addMember = async (groupId) => {
    // Perform any necessary actions (e.g., logging or validations)
    console.log(`Navigating to Add Members page for group ID: ${groupId}`);

    // Navigate to the Add Members page with the groupId
    navigate(`/groups/${groupId}/add-members`);
  };

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

  const modifyGroup = async (groupId) => {
    // Perform any asynchronous actions (e.g., API calls) if needed
    console.log(`Modifying group with ID: ${groupId}`);

    // Navigate to the EditGroup page
    navigate(`/edit-group/${groupId}`);
  };

  const handleSelectMember = (user) => {
    const userId = user._id || user.id;
    if (!userId) return;

    const chatId = generateChatId(loggedInUserId, userId);
    console.log("created id", chatId);
    setSelectedMember(userId);
    setSelectedUserName(user.fullName || "");
    setSelectedUserImage(user.photo || "");
    setSelectedChatId(chatId);
    setShowMessage(true);
    // Clear selected group when a member is selected
    setSelectedGroup(null);

    if (!contacts.some((contact) => contact._id === user._id)) {
      setContacts((prevContacts) => [user, ...prevContacts]);
    }
    // Leave previous chat if any
    if (selectedChatId) {
      socketRef.current.emit("leaveChat", {
        chatId: selectedChatId,
        userId: loggedInUserId,
      });
    }

    // Join new chat
    socketRef.current.emit("joinChat", { chatId, userId: loggedInUserId });

    if (chats[chatId]) {
      fetchMessagesForChat(chatId, userId);
      // setMessages(chats[chatId]);
    } else {
      setMessages([]);
      fetchMessagesForChat(chatId, userId);
    }
  };

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-white h-screen text-[9px] xs:text-[10px] sm:text-[13px] md:text-[14px]">
      <div className="sm:grid sm:grid-cols-12 mdm:w-[800px] lg:w-[1000px] mx-auto">
        {/* Left Side - Search Users */}
        <div className="col-span-4 border-r-[1px] pr-2 h-screen ml-2">
          {/* Search Bar Section */}
          <div className="flex justify-center mt-5 sm:justify-between items-center">
            <div>
              <div className="flex items-center w-[250px] sm:w-[180px] mdm:w-[200px] lg:w-[250px] relative">
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
                <p className="text-center text-red-500 mt-4">{errorMessage}</p>
              )}
              {isLoading && <LoadingSpinner />}
            </div>
            {/* Create Group Button */}
            <Link to="/create-group">
              <div className="OrangeButtonWithText-v3 fixed bottom-1 right-1 sm:relative flex items-center cursor-pointer justify-center">
                <p className="text-2xl">+</p>
              </div>
            </Link>
          </div>

          {/* Search Results and Chats Section */}
          {isSearching ? (
            <div className="flex justify-center items-center mt-5">
              <div className="loader"></div>
            </div>
          ) : (
            <div>
              {/* Display filtered results or contacts in Chats */}
              <div className="ml-10 mr-2 mt-5 relative right-8">
                <p className="poppins-semibold text-[15px]">Chats</p>

                {searchQuery.trim() ? (
                  searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => handleSelectMember(user)}
                        className="cursor-pointer"
                      >
                        <InfluncerMessage
                          Image={user.photo}
                          Name={user.fullName}
                          Time={userStatus[user._id] ? "Online" : "Offline"}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No contacts found</p>
                  )
                ) : contacts && contacts.length > 0 ? (
                  contacts.map((contact, index) => (
                    <div
                      key={contact._id || index} // Fallback to index if _id is missing
                      onClick={() => handleSelectMember(contact)}
                      className="cursor-pointer"
                    >
                      <InfluncerMessage
                        Image={contact.photo || "default-photo-url"} // Default image if missing
                        Name={contact.fullName || "Unknown"}
                        Time={userStatus[contact._id] ? "Online" : "Offline"}
                        Message={latestMessages[contact.id]?.text}
                      />
                    </div>
                  ))
                ) : (
                  <p>No members found</p>
                )}
              </div>
            </div>
          )}
          {showGroupOptions && selectedGroup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <p>Edit Group</p>
                <p>Delete Group</p>
                <p onClick={() => setShowGroupOptions(false)}>Close</p>
              </div>
            </div>
          )}

          {alertMessage && (
            <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 text-center z-50 shadow-md rounded-md">
              {alertMessage}
            </div>
          )}

          {/* Groups Section */}
          <div className="mt-5 ml-10 mr-2 relative right-8">
            <p className="poppins-semibold text-[15px]">Groups</p>
            {groups && groups.length > 0 ? (
              groups.map((group) => (
                <div
                  key={group._id}
                  onClick={() => handleSelectGroup(group)}
                  className="cursor-pointer hover:bg-gray-200"
                >
                  <GroupChat
                    groupId={group._id} // Pass group ID
                    Image={group.photo} // Group image
                    Name={group.title} // Group name
                    onClick={() => handleSelectGroup(group)} // Group click handler
                    onDelete={() => deleteGroup(group._id)} // Wrap delete in an arrow function
                    onModify={() => modifyGroup(group._id)} // Modify group handler
                    onAdd={() => addMember(group._id)}
                    isAdmin={group.isAdmin}
                  />
                </div>
              ))
            ) : (
              <p>No groups found</p>
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
