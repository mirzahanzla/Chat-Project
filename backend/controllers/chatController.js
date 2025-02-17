import Message from "../models/Message.js";
import User from "../models/user.js";
// import SelectedChat from '../models/selectedMember.js';

// Fetch messages for a specific member
export const getMessagesByMember = async (req, res) => {
  const { member } = req.query;

  try {
    const user = await User.findOne({ fullName: member });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch messages where the user is either the sender or the receiver
    const messages = await Message.find({
      $or: [{ sender: user._id }, { receiver: user._id }],
    }).sort({ createdAt: -1 });

    if (messages.length === 0) {
      return res
        .status(200)
        .json({ message: "No messages found for this user." });
    }

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Error fetching messages", error });
  }
};
export const getContacts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    // Find all messages where the user is the sender
    const sentMessages = await Message.find({ sender: userId }).populate(
      "receiver",
      "fullName userName userType photo email"
    ) || [];

    // Find all messages where the user is the receiver
    const receivedMessages = await Message.find({ receiver: userId }).populate(
      "sender",
      "fullName userName userType photo email"
    ) || [];

    // Create a Map to store unique contacts
    const contacts = new Map();

    // Add each receiver (from sent messages) to contacts if sentMessages exists and has content
    if (sentMessages.length > 0) {
      sentMessages.forEach((msg) => {
        const { chatId, receiver } = msg;
        if (receiver) {
          contacts.set(receiver._id.toString(), {
            id: receiver._id,
            fullName: receiver.fullName,
            userName: receiver.userName,
            userType: receiver.userType,
            photo: receiver.photo,
            email: receiver.email,
            chatId,
          });
        }
      });
    }

    // Add each sender (from received messages) to contacts if receivedMessages exists and has content
    if (receivedMessages.length > 0) {
      receivedMessages.forEach((msg) => {
        const { chatId, sender } = msg;
        if (sender) {
          contacts.set(sender._id.toString(), {
            id: sender._id,
            fullName: sender.fullName,
            userName: sender.userName,
            userType: sender.userType,
            photo: sender.photo,
            email: sender.email,
            chatId,
          });
        }
      });
    }

    // Convert map values to an array and send as a response
    return res.status(200).json([...contacts.values()]);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByChatId = async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.query;

  try {
    const query = { chatId };
    if (userId) {
      query.$or = [{ sender: userId }, { receiver: userId }];
    }

    const messages = await Message.find(query).sort({ createdAt: 1 });

    if (messages.length > 0) {
      return res.status(200).json(messages);
    } else {
      // If no messages found, return a response saying no messages
      // Instead of trying to create a new message, return a message indicating the chat is empty
      return res
        .status(200)
        .json({ message: "No messages yet. Start a new conversation!" });
    }
  } catch (error) {
    console.error("Error retrieving messages by chatId:", error);
    return res
      .status(500)
      .json({ message: "Error retrieving messages", error });
  }
};

export const getLastMessageByChatId = async (req, res) => {
    const { chatId } = req.params;
    const { userId } = req.query;
  
    try {
      const query = { chatId };
      if (userId) {
        query.$or = [{ sender: userId }, { receiver: userId }];
      }
  
      // Find the last message only by sorting in descending order and limiting to 1
      const lastMessage = await Message.findOne(query).sort({ createdAt: -1 });
  
      if (lastMessage) {
        return res.status(200).json(lastMessage);
      } else {
        // No messages found, return an informative message
        return res.status(200).json({ message: "No messages yet. Start a new conversation!" });
      }
    } catch (error) {
      console.error("Error retrieving last message by chatId:", error);
      return res.status(500).json({ message: "Error retrieving messages", error });
    }
  };
  