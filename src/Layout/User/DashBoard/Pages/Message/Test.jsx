// eslint-disable-next-line no-unused-vars
import React, { useState,useEffect } from "react";

function Test({
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleSendGroupMessage,
  messagesEndRef,
  loggedInUserId,
  groupId, // Assuming groupId is passed as a prop
}) {
  const [bgColor, setBgColor] = useState("#beb0b0"); // Default background color
    // Retrieve the saved background color on component mount
    useEffect(() => {
      const savedColor = localStorage.getItem("bgColor");
      if (savedColor) {
        setBgColor(savedColor);
      }
    }, []);
  // Enhanced formatTime function to handle both time and date display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", timestamp);
      return "Invalid Time"; // Fallback for invalid timestamps
    }

    const today = new Date();
    const isSameDay = today.toDateString() === date.toDateString();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    // If the message was sent today, show only time, otherwise show the date
    if (isSameDay) {
      return `${hours}:${minutes} ${ampm}`;
    } else {
      return `${date.toDateString()} ${hours}:${minutes} ${ampm}`;
    }
  };

  // Handle sending message logic based on groupId
  const handleSend = () => {
    if (groupId) {
      // If there is a groupId, send as a group message
      handleSendGroupMessage(groupId, newMessage);
    } else {
      // Otherwise, send as a normal message
      handleSendMessage(newMessage);
    }
    setNewMessage(""); // Clear the input after sending the message
  };
  // Function to change background color
  const changeBgColor = (color) => {
    setBgColor(color);
    localStorage.setItem("bgColor", color); // Save the color in localStorage
  };

  return (
    <>
      {/* Container for the message list */}
      <div
        className="overflow-y-auto h-[350px] sm:h-[450px] p-2 rounded-lg border border-gray-300"
        style={{ backgroundColor: bgColor }} // Dynamically set background color
      >
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg, index) => {
            // Determine alignment based on sender and receiver IDs
            const isSender =
              msg.sender === loggedInUserId ||
              msg.sender._id === loggedInUserId;
            const justifyClass = isSender ? "justify-end" : "justify-start";
            const messageClass = isSender
              ? "bg-orange-260 text-white" // Style for messages sent by the user
              : "bg-gray-300 text-black"; // Style for messages received

            return (
              <div
                key={index}
                className={`flex ${justifyClass} animate-fade-in`} // Adds animation class
              >
                <div
                  className={`message ${messageClass} p-2 rounded-lg mb-2 bg-gray-100 shadow-md max-w-[55%]`}
                >
                  <p
                    style={{
                      fontSize: "0.75rem", // Smaller font size
                      fontWeight: "bold", // Bold text
                      color: "rgb(255, 105, 180)",
                      animation: "fadeIn 0.5s ease", // Inline animation for smooth effect
                    }}
                  >
                    {isSender ? "You" : msg.sender?.fullName}
                  </p>

                  <p style={{ fontSize: "0.875rem", color: "black" }}>
                    {msg.text}
                  </p>

                  <p
                    className="text-xs text-gray-500 mt-1"
                    style={{
                      fontSize: "0.75rem", // Extra small font size for time
                      textAlign: "right",
                      display: "block",
                      animation: "fadeInUp 0.5s ease", // Animating time as it appears
                    }}
                  >
                    {formatTime(msg.createdAt || msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
        {/* Scroll to the latest message */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area for new messages */}
      <div className="flex mt-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg p-2"
        />
        <img
          src="/Svg/Send.svg"
          className="cursor-pointer"
          onClick={handleSend} // Use handleSend to check if it's a group or regular message
          alt="Send"
        />
      </div>
      {/* Color Picker for changing the background */}
      <div className="absolute top-4 right-4 flex space-x-2 hidden lg:flex">
  {["#beb0b0", "#f7b7a3", "#b0e0e6", "#98fb98"].map((color, index) => (
    <div
      key={index}
      onClick={() => changeBgColor(color)}
      className="w-5 h-5 rounded-full cursor-pointer"
      style={{ backgroundColor: color }}
    />
  ))}
</div>

    </>
  );
}

// Export the component
export default Test;
