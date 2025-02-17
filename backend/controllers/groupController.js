import Group from '../models/Group.js';
import Message from '../models/Message.js';
// import User from '../models/user.js';
import mongoose from 'mongoose';
import { storage } from '../config/firebase.js';
import { ref, uploadBytes, getDownloadURL ,deleteObject } from 'firebase/storage';

// Create a new group
export const createGroup = async (req, res) => {
  const { title, members, admin } = req.body;
  const groupPhoto = req.file; // Uploaded image file

  try {
    let groupPhotoURL = '';
    if (groupPhoto) {
      // Correct MIME type check
      if (!groupPhoto.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Invalid file type. Please upload an image.' });
      }

      const maxSize = 5 * 1024 * 1024; // 5MB limit
      if (groupPhoto.size > maxSize) {
        return res.status(400).json({ message: 'File size exceeds the 5MB limit.' });
      }

      // Upload the image to Firebase Storage
      const imgRef = ref(storage, `groupImages/${Date.now()}_${groupPhoto.originalname}`);
      await uploadBytes(imgRef, groupPhoto.buffer);
      groupPhotoURL = await getDownloadURL(imgRef);
    }

    // Parse members if passed as a JSON string
    const parsedMembers = JSON.parse(members);

    // Save the new group to the database with the image URL if it exists
    const group = new Group({ title, members: parsedMembers, photo: groupPhotoURL, admin });
    await group.save();

    res.status(201).json({ success: true, group });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Error creating group' });
  }
};

// Add member(s) to an existing group
export const addGroupMember = async (req, res) => {
  const { groupId, memberIds } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    group.members.push(...memberIds);
    await group.save();

    res.status(200).json({ success: true, group });
  } catch (error) {
    console.error('Error adding group member:', error);
    res.status(500).json({ message: 'Error adding group member' });
  }
};

// Fetch messages for a group
export const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await Message.find({ groupId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching group messages:', error);
    res.status(500).json({ message: 'Error fetching group messages' });
  }
};

// Send a message to a group
export const sendGroupMessage = async (req, res) => {
  const { text, sender, groupId } = req.body;

  try {
    const message = new Message({ text, sender, groupId, chatId: groupId });
    await message.save();

    // Emit the message to all group members via Socket.IO if needed
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending group message:', error);
    res.status(500).json({ message: 'Failed to send group message' });
  }
};



// Get groups for a specific admin
export const getGroups = async (req, res) => {
  const { admin } = req.params;

  // Validate if `admin` is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(admin)) {
    return res.status(400).json({ message: 'Invalid admin ID format' });
  }

  try {
    const groups = await Group.find({
      $or: [
        { admin: admin },         // Check if the user is the admin
        { members: admin }         // Check if the user is in the members array
      ]
    }).populate({
      path: 'members',           // Populate the members field
      select: 'fullName'         // Only include the userName field for each member
    })
    .populate({
      path: 'admin',             // Populate the admin field
      select: 'fullName'         // Only include the userName field for the admin
    }).populate({
      path: 'messages.sender',   // Populate the sender field in each message
      select: 'fullName'         // Retrieve only the fullName for each sender
    });

    if (groups.length === 0) {
      return res.status(404).json({ message: 'No groups found for this admin' });
    }

    // console.log('Fetched groups for admin:', admin, groups);
    res.status(200).json({ groups });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Error fetching groups', error });
  }
};


export const getGroupMessagesByGroupId = async (req, res) => {
  const { groupId } = req.params;

  try {
    // Ensure groupId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: 'Invalid Group ID format' });
    }

    // Fetch the group from the database
    const group = await Group.findById(groupId).populate('messages.sender', 'username fullName');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    return res.status(200).json({ messages: group.messages });
  } catch (error) {
    console.error('Error fetching group messages:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};



// Modify an existing group
export const modifyGroup = async (req, res) => {
  const { groupId } = req.params;
  const { title, members, admin } = req.body;
  const groupPhoto = req.file;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // Update the group's title and admin if provided
    if (title) group.title = title;
    if (admin) group.admin = admin;

    // Update group members
    if (members) group.members = JSON.parse(members);

    // If a new image is provided, replace the old one
    if (groupPhoto) {
      // Check and upload the new image
      const imgRef = ref(storage, `groupImages/${Date.now()}_${groupPhoto.originalname}`);
      await uploadBytes(imgRef, groupPhoto.buffer);
      const groupPhotoURL = await getDownloadURL(imgRef);

      // Delete the old image from Firebase storage if it exists
      if (group.photo) {
        const oldImgRef = ref(storage, group.photo);
        await deleteObject(oldImgRef);
      }

      group.photo = groupPhotoURL;
    }

    await group.save();
    res.status(200).json({ success: true, group });
  } catch (error) {
    console.error('Error modifying group:', error);
    res.status(500).json({ message: 'Error modifying group' });
  }
};
// Delete a group
// Delete a group
export const deleteGroup = async (req, res) => {
  const { groupId } = req.params; // Extract groupId from request parameters

  try {
    // Find the group by its ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check and delete the group's photo from Firebase storage, if it exists
    if (group.photo) {
      try {
        const imgRef = ref(storage, group.photo);
        await deleteObject(imgRef);
        console.log('Group photo deleted from Firebase storage');
      } catch (imgError) {
        console.error('Error deleting group photo from Firebase:', imgError);
        // You can return a different message or ignore it based on the use case
        return res.status(500).json({ message: 'Error deleting group photo from Firebase', error: imgError.message });
      }
    }

    // Delete all messages associated with this group
    await Message.deleteMany({ groupId });
    console.log(`Messages associated with group ${groupId} deleted`);

    // Delete the group itself using deleteOne instead of remove
    await Group.deleteOne({ _id: groupId });
    console.log(`Group with ID ${groupId} deleted`);

    // Send success response
    res.status(200).json({ success: true, message: 'Group deleted successfully' });

  } catch (error) {
    console.error('Error deleting group:', error);
    // Send error response with detailed message
    res.status(500).json({ message: 'Error deleting group', error: error.message, stack: error.stack });
  }
};






// Fetch all groups
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('admin', 'fullName')
      .populate('members', 'fullName');
    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Error fetching groups' });
  }
};


// Fetch group by ID with only title and photo
export const getGroupById = async (req, res) => {
  const { id } = req.params; // Extract the group ID from the route parameters
  try {
    const group = await Group.findById(id)
      .select('title photo'); // Select only the title and photo fields

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('Error fetching group by ID:', error);
    res.status(500).json({ message: 'Error fetching group by ID' });
  }
};
