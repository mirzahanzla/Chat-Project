import Contract from '../models/contractModel.js';
import InstaMedia from '../models/instagramMedia.js';
import User from '../models/user.js'; // Assuming you have a user model for influencer data

export const getInstaMediaByDealID = async (req, res) => {
  const { dealID } = req.params;

  if (!dealID) {
    return res.status(400).json({ message: 'Deal ID is required' });
  }

  try {
    // Find all contracts related to the provided dealID
    const contracts = await Contract.find({ dealID: dealID });

    if (contracts.length === 0) {
      return res.status(404).json({ message: 'No contracts found for this deal' });
    }

    // Initialize an array to store the instaMedia collections
    let allInstaMedia = [];

    // Loop through each contract and find related instaMedia collections
    for (const contract of contracts) {
      const instaMedia = await InstaMedia.find({ contractID: contract._id });

      // For each media item, fetch the corresponding influencer details
      for (let media of instaMedia) {
        const influencer = await User.findById(media.influencerID); // Fetch influencer by ID

        if (influencer) {
          media = {
            ...media._doc, // Spread media data
            influencerPhoto: influencer.photo, // Add influencer photo
            influencerName: influencer.fullName // Add influencer full name
          };
        }
        allInstaMedia.push(media); // Add the enriched media object to the array
      }
    }

    // If no instaMedia collections were found for any contracts
    if (allInstaMedia.length === 0) {
      return res.status(404).json({ message: 'No instaMedia found for the contracts related to this deal' });
    }

    // Return all the instaMedia collections with influencer details
    res.status(200).json({ instaMedia: allInstaMedia });

  } catch (error) {
    console.error('Error fetching instaMedia:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getEngagementAndBudgetByDealID = async (req, res) => {
  const { dealID } = req.params;

  if (!dealID) {
    return res.status(400).json({ message: 'Deal ID is required' });
  }

  try {
    // Find all contracts related to the provided dealID
    const contracts = await Contract.find({ dealID: dealID });

    if (contracts.length === 0) {
      return res.status(404).json({ message: 'No contracts found for this deal' });
    }

    // Initialize variables to store sums
    let totalContractBudget = 0;
    let totalLikes = 0;
    let totalComments = 0;

    // Loop through each contract and calculate the total budget from milestones
    for (const contract of contracts) {
      if (contract.milestones && contract.milestones.length > 0) {
        const contractBudget = contract.milestones.reduce((sum, milestone) => {
          // Exclude budget addition if status is 'Payment Pending' or 'Invited'
          if (milestone.status !== 'Payment Pending' && milestone.status !== 'Invited') {
            return milestone.budget ? sum + milestone.budget : sum;
          }
          return sum; // Skip budget if status is 'Payment Pending' or 'Invited'
        }, 0);
        
        totalContractBudget += contractBudget;
      }

      // Fetch all instaMedia related to the current contract
      const instaMedia = await InstaMedia.find({ contractID: contract._id });

      for (let media of instaMedia) {
        // Sum up likes and comments
        totalLikes += media.likes || 0;
        totalComments += media.comments || 0;

        // Optionally, fetch the influencer details if needed
        const influencer = await User.findById(media.influencerID);
        if (influencer) {
          media = {
            ...media._doc, // Spread media data
            influencerPhoto: influencer.photo, // Add influencer photo
            influencerName: influencer.fullName // Add influencer full name
          };
        }
      }
    }

    // Calculate total engagements (likes + comments)
    const totalEngagements = totalLikes + totalComments;

    // Return the totals
    res.status(200).json({
      totalContractBudget,
      totalLikes,
      totalComments,
      totalEngagements
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
