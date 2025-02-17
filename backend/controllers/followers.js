import User from '../models/user.js';
// controllers/followers.js

// Follow User
export const followUser = async (req, res) => {
    const { username, userId } = req.body; // Extract the userId and username from the request body

    try {
        const userToFollow = await User.findOne({ userName: username }); // Find the user to follow by username
        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is already following
        if (userToFollow.followersList.includes(userId)) {
            return res.status(400).json({ message: 'Already following this user' });
        }

        // Add the userId to the followersList of the user to follow
        userToFollow.followersList.push(userId);
        userToFollow.followers += 1; // Increase the follower count
        await userToFollow.save();

        res.status(200).json({ message: 'Successfully followed the user' });
    } catch (error) {
        res.status(500).json({ message: 'Error following the user', error });
    }
};

// Unfollow User
export const unfollowUser = async (req, res) => {
    const { username, userId } = req.body; // Extract the userId and username from the request body

    try {
        const userToUnfollow = await User.findOne({ userName: username }); // Find the user to unfollow by username
        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is not following the user
        if (!userToUnfollow.followersList.includes(userId)) {
            return res.status(400).json({ message: 'You are not following this user' });
        }

        // Remove the userId from the followersList of the user to unfollow
        userToUnfollow.followersList = userToUnfollow.followersList.filter(follower => follower.toString() !== userId);
        userToUnfollow.followers -= 1; // Decrease the follower count
        await userToUnfollow.save();

        res.status(200).json({ message: 'Successfully unfollowed the user' });
    } catch (error) {
        res.status(500).json({ message: 'Error unfollowing the user', error });
    }
};

// Get follow status
export const checkFollowStatus = async (req, res) => {
    const { username, userId } = req.query;

    try {
        const user = await User.findOne({ userName: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFollowing = user.followersList.includes(userId);
        res.status(200).json({ isFollowing });
    } catch (error) {
        res.status(500).json({ message: 'Error checking follow status', error });
    }
};