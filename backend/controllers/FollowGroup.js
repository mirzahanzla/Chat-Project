

import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // User model
import Group from '../models/Group.js'; // Group model

export const toggleFollowGroup = async (req, res) => {
    const { groupId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      // eslint-disable-next-line no-undef
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
    
        //  Check if the user is already a member of the group
    // const isMember = group.members.some(
    //   (member) => member.toString() === user._id.toString()
    // );

    // if (isMember) {
    //   return res
    //     .status(400)
    //     .json({ message: 'User is already a member of this group' });
    // }

      let isFollowing = false;
  
      // Toggle Follow/Unfollow
      if (user.followedGroups.includes(groupId) ) {
        user.followedGroups = user.followedGroups.filter((id) => id.toString() !== groupId);
        group.followedBy = group.followedBy.filter((id) => id.toString() !== user._id.toString());
        group.members = group.members.filter((id) => id.toString() !== user._id.toString());
      } else {
        user.followedGroups.push(groupId);
        group.followedBy.push(user._id);
        group.members.push(user._id);
        isFollowing = true;
      }
  
      await user.save();
      await group.save();
  
      return res.status(200).json({
        message: isFollowing ? 'Followed the group successfully' : 'Unfollowed the group successfully',
        groupId,
        isFollowing,
      });
    } catch (error) {
      console.error('Error toggling follow status:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  

  // export const checkFollowStatus = async (req, res) => {
  //   const token = req.headers.authorization?.split(' ')[1];
  
  //   if (!token) {
  //     return res.status(401).json({ message: 'Unauthorized' });
  //   }
  
  //   try {
  //     // eslint-disable-next-line no-undef
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     const user = await User.findById(decoded.id).populate('followedGroups');
  
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }
  
  //     const followedGroups = user.followedGroups.map((group) => ({
  //       _id: group._id,
  //       title: group.title,
  //       isFollowing: true, // Status is always true for followed groups
  //     }));
  // // console.log("hanzla mirza",followedGroups)
  //     return res.status(200).json(followedGroups);
  //   } catch (error) {
  //     console.error('Error fetching follow status:', error);
  //     return res.status(500).json({ message: 'Server error' });
  //   }
  // };
  
  export const checkFollowStatus = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      // Verify the token
      // eslint-disable-next-line no-undef
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).populate('followedGroups');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Fetch all groups to check membership
      const allGroups = await Group.find({}).populate('members');
  
      // Map the followedGroups and add membership status
      const followedGroups = user.followedGroups.map((group) => ({
        _id: group._id,
        title: group.title,
        isFollowing: true, // Status is always true for followed groups
      }));
  
      // Check if the user is a member of any group they haven't followed
      for (const group of allGroups) {
        const isMember = group.members.some(
          (member) => member._id.toString() === user._id.toString()
        );
  
        const isAlreadyFollowing = followedGroups.some(
          (followedGroup) => followedGroup._id.toString() === group._id.toString()
        );
  
        if (isMember && !isAlreadyFollowing) {
          // Automatically add the user to the followedGroups
          user.followedGroups.push(group._id);
          followedGroups.push({
            _id: group._id,
            title: group.title,
            isFollowing: true,
          });
        }
      }
  
      // Save updated user if new groups were added
      await user.save();
  
      // Respond with the updated follow status
      return res.status(200).json(followedGroups);
    } catch (error) {
      console.error('Error fetching follow status:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  
  export const unfollowGroup = async (req, res) => {
    const { groupId } = req.body; // Get groupId from request body
    const token = req.headers.authorization?.split(' ')[1]; // Extract token
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      // Verify token and extract user ID
      // eslint-disable-next-line no-undef
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the group to ensure it exists
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      // Remove the groupId from the user's followedGroups list
      user.followedGroups = user.followedGroups.filter(
        (id) => id.toString() !== groupId
      );
  
      // Remove the user's ID from the group's followedBy list
      group.followedBy = group.followedBy.filter(
        (id) => id.toString() !== user._id.toString()
      );
      // Remove the user's ID from the group's followedBy list
      group.members = group.members.filter(
        (id) => id.toString() !== user._id.toString()
      );
  
      // Save the updated user and group records
      await user.save();
      await group.save();
  
      return res.status(200).json({
        message: 'Successfully unfollowed the group.',
        groupId,
      });
    } catch (error) {
      console.error('Error unfollowing the group:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
