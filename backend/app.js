import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import http from 'http';
import './config/mongodb.js'; // MongoDB connection file
import groupRoutes from './routes/group.js';
import Group from './models/Group.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import influencerRoutes from './routes/influencerRoutes.js';
import blogs from './routes/blog.js';
import campaign from './routes/campaign.js';
import chatRoutes from './routes/chatRoutes.js';
import search from './routes/search.js';

import MessageModel from './models/Message.js'; // Message model
import userss from './models/user.js'; // User model
import { storage } from './config/firebase.js';
import { ref, listAll } from 'firebase/storage';
import { updateInstagramPostData } from './controllers/extracter.js';
import report from './routes/extract.js';

import NewUserRoutes from './routes/NewAuth/users.js';
import NewAuthRoutes from './routes/NewAuth/auth.js';

import CustomerService from './routes/Support/Support.js';
import Issues from './routes/Support/Issues.js';
import SignUpCheck from './API/SignUpCheck/SignUp.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});



// List of allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5500',
];

// Dynamic CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps or CURL)
    if (!origin) return callback(null, true);

    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, '../dist')));

app.use('/Support',CustomerService)
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/Newauth/users', NewUserRoutes);
app.use('/Newauth/auth', NewAuthRoutes);
app.use('/api', influencerRoutes);
app.use('/influencer', blogs);
app.use('/Brand', blogs);
app.use('/Brand', campaign);
app.use('/api/users', search);
app.use('/api/messages', chatRoutes);
app.use('/api/groups', groupRoutes);
app.use("/api/issues",Issues );
app.use("/SignUpCheck", SignUpCheck);
app.use("/report", report);

const checkFirebaseConnection = async () => {
  try {
    const storageRef = ref(storage);
    await listAll(storageRef);
    console.log('Connected to Firebase Storage');
  } catch (error) {
    console.error('Error connecting to Firebase Storage:', error);
  }
};

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const userSocketMap = {};
const groupUsers = {};
let users = {};
io.on('connection', (socket) => {
  console.log('New client connected');
  console.log('A user connected:', socket.id);

  socket.on('join', async (userId) => {
    if (userId) {
      try {
        const user = await userss.findById(userId);
        if (user) {
          console.log(`User ${userId} (${user.fullName}) joined with socket ID: ${socket.id}`);

          userSocketMap[userId] = socket.id;
          socket.userId = userId;
          socket.join(userId.toString());

          io.emit('userOnline', userId); // Notify everyone the user is online
          io.emit('onlineUser', Object.keys(userSocketMap));
        } else {
          console.error(`User with ID ${userId} not found`);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    } else {
      console.error('User ID is missing');
    }
  });


  socket.on('joinGroup', ({ groupId, userId }) => {
    socket.join(groupId);
    console.log(`User ${userId} joined group ${groupId}`);
    console.log("Current rooms after joining:", io.sockets.adapter.rooms); // Check room map immediately after joining
  
    // Ensure user is added to groupUsers object
    if (!groupUsers[groupId]) groupUsers[groupId] = new Set();
    groupUsers[groupId].add(userId);
  
    // Notify all group members
    io.to(groupId).emit('userJoined', { userId, message: 'A user has joined the group' });
  });

socket.on("sendGroupMessage", async (data) => {
  const { text, sender, groupId } = data;

  if (!groupId || !text || !sender) {
      console.error("Group message data is incomplete:", data);
      return;
  }
  // const user = await userss.findById(sender);
  // if (!user || !user.followedGroups.includes(groupId)) {
  //  const error = "You are not allowed to send messages to this group.";
  //  console.warn(error);
  //  callback({ error });
  //   return;
  // }

  console.log(`Group message from ${sender} to Group ID ${groupId}: ${text}`);
  console.log("Current rooms and members:", io.sockets.adapter.rooms);

  try {

      // Save the message to the database
      const newMessage = {
          sender,
          text,
          createdAt: new Date(),
      };

      const group = await Group.findById(groupId);
      if (!group) {
          socket.emit("error", { message: "Group not found" });
          return;
      }
      group.messages.push(newMessage);
      await group.save();

      // Broadcast the message to all users in the group room
      io.to(groupId).emit("receiveGroupMessage", {
          ...newMessage,
          groupId,
      });

      console.log(`Message sent to Group ID ${groupId}`);
  } catch (error) {
      console.error("Error sending group message:", error);
      socket.emit("error", { message: "Message could not be sent" });
  }
});


socket.on("sendGroupMessageUser", async (data,callback) => {
  const { text, sender, groupId } = data;

  if (!groupId || !text || !sender) {
    const error = "Group message data is incomplete.";
    console.error(error, data);
    callback({ error });
      return;
  }

  console.log(`Group message from ${sender} to Group ID ${groupId}: ${text}`);
  console.log("Current rooms and members:", io.sockets.adapter.rooms);

  try {

     // Check if the user follows the group
     const user = await userss.findById(sender);
     if (!user || !user.followedGroups.includes(groupId)) {
      const error = "You are not allowed to send messages to this group.";
      console.warn(error);
      callback({ error });
       return;
     }
      // Save the message to the database
      const newMessage = {
          sender,
          text,
          createdAt: new Date(),
      };

      const group = await Group.findById(groupId);
      if (!group) {
        const error = "Group not found.";
        console.error(error);
        callback({ error });
          return;
      }
      group.messages.push(newMessage);
      await group.save();

      // Broadcast the message to all users in the group room
      io.to(groupId).emit("receiveGroupMessageUser", {
          ...newMessage,
          groupId,
      });
      callback(null); // Acknowledge successful operation
      console.log(`Message sent to Group ID ${groupId}`);
  } catch (error) {
      console.error("Error sending group message:", error);
      callback({ error: "Message could not be sent." });
      // socket.emit("error", { message: "Message could not be sent" });
  }
});


  socket.on('sendMessage', async (data) => {
    const { text, sender, receiver, chatId } = data;

    if (!chatId || !text || !sender || !receiver) {
      console.error('Message data is incomplete:', data);
      return;
    }

    console.log(`Message from ${sender} to ${receiver} (Chat ID: ${chatId}): ${text}`);

    try {
      const newMessage = new MessageModel({
        chatId,
        sender,
        receiver,
        text,
        createdAt: new Date(),
      });
      await newMessage.save();

      const receiverSocketId = userSocketMap[receiver];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', newMessage);
        console.log(`Message sent to receiver ${receiver}`);
      } else {
        console.log(`User ${receiver} is offline`);
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('leaveGroup', ({ groupId, userId }) => {
    socket.leave(groupId); // Leave the group room
    console.log(`User ${userId} left group ${groupId}`);
  });
  
  // Handle user status change (user logs in or out)
  socket.on('userStatusChange', (userId, status) => {
    users[userId] = status; // Update the user's status
    io.emit('userStatusChanged', { userId, status }); // Emit status change to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const userId = Object.keys(userSocketMap).find(id => userSocketMap[id] === socket.id);
    if (userId) {
      delete userSocketMap[userId];
      io.emit('userOffline', userId);
      io.emit('onlineUser', Object.keys(userSocketMap));
    }
  });
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  checkFirebaseConnection();
  console.log('Testing Instagram post data update...');
  try {
    await updateInstagramPostData();
  } catch (error) {
    console.error('Instagram data update test failed:', error.message);
  }
});
