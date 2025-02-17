import User from '../models/user.js';
import Group from '../models/Group.js';

// Controller for searching users by name or username
export const searchUsersGroup = async (req, res) => {
  const { query } = req.query; // 'query' will be passed as a URL parameter

  if (!query || query.trim() === '') {
    return res.status(400).json({ message: 'Search query cannot be empty' });
  }

  try {
    // Case-insensitive search for users by name or username
    const users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: 'i' } }, // Search by full name
        { userName: { $regex: query, $options: 'i' } }  // Search by username
      ]
    });

    // If no users are found, return an empty array with a 200 status
    if (!users || users.length === 0) {
      return res.status(200).json([]); // Send 200 with an empty array
    }

    // Return the list of users found
    return res.status(200).json(users);
  } catch (error) {
    // Log error and return a generic error message
    console.error(`Error occurred while searching for users: ${error}`);
    return res.status(500).json({ message: 'An internal server error occurred' });
  }
};





// Controller for searching users by name or username
export const searchUsersGroupMember = async (req, res) => {
  const { query, groupId } = req.query; // 'query' will be passed as a URL parameter, 'groupId' is passed to filter group members

  if (!query || query.trim() === '') {
    return res.status(400).json({ message: 'Search query cannot be empty' });
  }

  if (!groupId) {
    return res.status(400).json({ message: 'Group ID is required' });
  }

  try {
    // Find the group to get its current members
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Get the list of member IDs to exclude them from search results
    const existingMembers = group.members.map((member) => member.toString());

    // Case-insensitive search for users by full name or username, excluding group members
    const users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: 'i' } }, // Search by full name
        { userName: { $regex: query, $options: 'i' } }  // Search by username
      ],
      _id: { $nin: existingMembers } // Exclude existing group members
    });

    // If no users are found, return an empty array with a 200 status
    if (!users || users.length === 0) {
      return res.status(200).json([]); // Send 200 with an empty array
    }

    // Return the list of users found
    return res.status(200).json(users);
  } catch (error) {
    // Log error and return a generic error message
    console.error(`Error occurred while searching for users: ${error}`);
    return res.status(500).json({ message: 'An internal server error occurred' });
  }
};




// Controller for searching influencers and brands by name or username
export const searchUsers = async (req, res) => {
  const { query } = req.query; // 'query' will be passed as a URL parameter

  if (!query || query.trim() === '') {
    return res.status(400).json({ message: 'Search query cannot be empty' });
  }

  try {
    // Case-insensitive search for influencers and brands by name or username
    const users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: 'i' } }, // Search by full name
        { userName: { $regex: query, $options: 'i' } }  // Search by username
      ],
      userType: { $in: ['influencer', 'brand'] }  // Filter only influencers and brands
    });

    // If no users are found, return an empty array with a 200 status
    if (!users || users.length === 0) {
      return res.status(200).json([]); // Send 200 with an empty array
    }

    // Return the list of users found
    return res.status(200).json(users);
  } catch (error) {
    // Log error and return a generic error message
    console.error(`Error occurred while searching for influencers and brands: ${error}`);
    return res.status(500).json({ message: 'An internal server error occurred' });
  }
};
