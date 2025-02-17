import Brand from '../models/brands.js';
import Deal from '../models/Deals.js';
import jwt from 'jsonwebtoken';
import Contract from '../models/contractModel.js'; // Adjust the import path according to your project structure
import Proposal from '../models/proposal.js'; // Import Proposal model
import User from '../models/user.js';
// import mongoose from 'mongoose';

export const getDeals = async (req, res) => {
  try {
    const authHeader = req.headers.authorization; // Authorization token

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token and extract the user ID
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    // Fetch user information to check verification status
    const user = await User.findById(userID).select('verified');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is verified
    if (!user.verified) {
      return res.status(403).json({ message: 'Please verify your profile first to view deals' });
    }

    // Fetch all brands with their deals
    const brands = await Brand.find().populate('deals.dealID'); // Assuming 'dealID' references a Deal

    if (brands.length === 0) {
      return res.status(200).json({ message: 'No deals found', data: [] });
    }

    // Set of deal IDs to filter out based on userStatuses
    const excludedDealIDs = new Set();

    // Go through deals, and check user status to exclude deals
    for (const brand of brands) {
      for (const deal of brand.deals) {
        const dealDetails = deal.dealID;  // Assuming populated `dealID` gives us the deal details

        if (dealDetails) {
          const userStatus = dealDetails.userStatuses.find(status => status.userID.toString() === userID.toString());

          if (userStatus && ['Approved', 'Requested', 'Invited'].includes(userStatus.status)) {
            excludedDealIDs.add(dealDetails._id.toString());
          }
        }
      }
    }

    // Map brands with filtered deals
    const updatedBrands = brands.map(brand => {
      const updatedDeals = brand.deals
        .map(deal => {
          const dealDetails = deal.dealID;

          if (dealDetails && !excludedDealIDs.has(dealDetails._id.toString())) {
            return {
              _id: dealDetails._id,
              dealImage: dealDetails.dealImage,
              campaignDes: dealDetails.campaignDes,
              taskDes: dealDetails.taskDes,
              category: dealDetails.category,
              platform: dealDetails.platform,
              followers: dealDetails.followers,
              engagement_Rate: dealDetails.engagement_Rate,
              userStatuses: dealDetails.userStatuses,
              budget: dealDetails.budget
            };
          }

          return null; // Deal is excluded
        })
        .filter(deal => deal !== null); // Remove null values (excluded deals)

      return {
        ...brand.toObject(), // Convert Mongoose document to plain object
        deals: updatedDeals
      };
    });

    res.status(200).json(updatedBrands);
  } catch (error) {
    console.error('Error fetching brands and deals:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getDealsByUserID = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'Token is required' });

    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    // Find deals with the specified userID in userStatuses
    const deals = await Deal.find({
      userStatuses: { $elemMatch: { userID: userID } }
    });

    if (deals.length === 0) {
      return res.status(200).json({ message: 'No deals found', data: [] });
    }

    // Create a set of deal IDs to efficiently filter brands
    const dealIdsSet = new Set(deals.map(deal => deal._id.toString()));

    // Find brands that have deals matching the relevant deal IDs
    const brands = await Brand.find({
      deals: { $elemMatch: { dealID: { $in: Array.from(dealIdsSet) } } }
    });

    // Map deals to their details for quick lookup
    const dealMap = new Map(deals.map(deal => [deal._id.toString(), deal]));

    // Attach detailed deal info to brands
    const updatedBrands = brands.map(brand => {
      const updatedDeals = brand.deals
        .map(deal => {
          const dealDetails = dealMap.get(deal.dealID.toString());
          if (dealDetails) {
            // Filter userStatuses to include only the object matching userID
            const filteredUserStatuses = dealDetails.userStatuses.filter(
              status => status.userID.toString() === userID.toString()
            );

            return {
              _id: dealDetails._id,
              dealImage: dealDetails.dealImage,
              campaignDes: dealDetails.campaignDes,
              taskDes: dealDetails.taskDes,
              category: dealDetails.category,
              platform: dealDetails.platform,
              followers: dealDetails.followers,
              engagement_Rate: dealDetails.engagement_Rate,
              userStatuses: filteredUserStatuses, // Only include the matching userID status
              budget: dealDetails.budget
            };
          }
          return null;
        })
        .filter(deal => deal !== null); // Remove null entries if no matching deal

      return {
        ...brand.toObject(), // Convert Mongoose document to plain object
        deals: updatedDeals
      };
    }).filter(brand => brand.deals.length > 0); // Filter out brands without matching deals

    res.status(200).json(updatedBrands);
  } catch (error) {
    console.error('Error fetching brands and deals:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getApprovedDeals = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) return res.status(400).json({ message: 'Token is required' });

    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    const brands = await Brand.find();
    
    if (brands.length === 0) {
      return res.status(200).json({ message: 'No deals found', data: [] });
    }
    
    // Collect all deal IDs from brands
    const dealIds = brands.flatMap(brand => brand.deals.map(deal => deal.dealID));
    const deals = await Deal.find({ _id: { $in: dealIds } });

    // Create a map of deals by their ID for quick lookup
    const dealMap = new Map(deals.map(deal => [deal._id.toString(), deal]));

    // Update brands with detailed deal information
    const updatedBrands = brands.map(brand => {
      const updatedDeals = brand.deals.map(deal => {
        const dealDetails = dealMap.get(deal.dealID.toString());

        if (dealDetails) {
          // Check if userID exists in userStatuses and has an 'Approved' status
          const userStatus = dealDetails.userStatuses.find(
            status => status.userID.toString() === userID.toString()
          );

          if (userStatus && userStatus.status === 'Approved') {
            return {
              _id: dealDetails._id,
              dealImage: dealDetails.dealImage,
              campaignDes: dealDetails.campaignDes,
              taskDes: dealDetails.taskDes,
              category: dealDetails.category,
              platform: dealDetails.platform,
              followers: dealDetails.followers,
              engagement_Rate: dealDetails.engagement_Rate,
              userStatuses: dealDetails.userStatuses,
              budget: dealDetails.budget
            };
          }
          return null;
        }
        return null;
      }).filter(deal => deal !== null); // Remove any null deals if not found or filtered out

      return {
        ...brand.toObject(), // Convert Mongoose document to plain object
        deals: updatedDeals
      };
    }).filter(brand => brand.deals.length > 0); // Filter out brands with no deals

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    res.status(200).json(updatedBrands);
  } catch (error) {
    console.error('Error fetching brands and deals:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getContractDetails = async (req, res) => {
  try {
    // Extract influencerID from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1]; // Extract influencerID from the token
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const influencerID = decoded.id;

    // Get the dealID from the request parameters
    const { contractID } = req.params;

    // Find the contract with the given dealID and influencerID
    const contract = await Contract.findOne({ _id: contractID, influencerID: influencerID });

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Get the last milestone
    const lastMilestone = contract.milestones[contract.milestones.length - 1];

    if (!lastMilestone) {
      return res.status(404).json({ message: 'No milestones found for this contract' });
    }

    // Prepare the response with contractID, budget, and status
    const contractDetails = {
      contractID: contract._id,
      budget: lastMilestone.budget,
      status: lastMilestone.status,
    };

    return res.status(200).json({ contractDetails }); // Include the contractDetails object in the response
  } catch (error) {
    console.error('Error fetching contract details:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
export const acceptContract = async (req, res) => {
  try {
    // Extract the influencerID from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Authorization header missing or invalid');
      return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token
    let decoded;

    try {
      // eslint-disable-next-line no-undef
      decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ message: 'Token verification failed' });
    }

    const influencerID = decoded.id; // Get the influencerID from the decoded token

    // Get the contract ID from the request parameters
    const { contractID } = req.params;

    // Find the contract by ID
    const contract = await Contract.findById(contractID);
    if (!contract) {
      console.error('Contract not found for ID:', contractID);
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check if there are milestones in the contract
    if (contract.milestones.length === 0) {
      console.error('No milestones found for contract:', contractID);
      return res.status(404).json({ message: 'No milestones found for this contract' });
    }

    // Get the last milestone
    const lastMilestone = contract.milestones[contract.milestones.length - 1];

    // Check if the deadline is in the future
    const currentDate = new Date();
    if (new Date(lastMilestone.deadline) <= currentDate) {
      console.error('The deadline must be a future date');
      return res.status(400).json({ message: 'The deadline must be a future date' });
    }

    // Update the status of the last milestone to "Payment Pending"
    lastMilestone.status = 'Payment Pending';

    // Create a new proposal from the milestone data
    const newProposal = new Proposal({
      budget: lastMilestone.budget,
      coverLetter: 'Influencer accepted invitation',
      posts: lastMilestone.posts,
      deadline: lastMilestone.deadline,
      revisions: lastMilestone.revisions,
    });

    // Save the new proposal to the database
    const savedProposal = await newProposal.save();

    // Update the contract to include the new proposal ID
    contract.proposalID = savedProposal._id; // Update the contract with the proposal ID
    await contract.save();

    // Now update the deal document
    const dealID = contract.dealID; // Assuming dealID is part of the contract
    const deal = await Deal.findById(dealID); // Find the deal by ID

    if (!deal) {
      console.error('Deal not found for ID:', dealID);
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Find the index of the userStatuses entry where the userID matches the influencerID and status is "Invited"
    const userStatusIndex = deal.userStatuses.findIndex(
      status => status.userID.toString() === influencerID && status.status === 'Invited'
    );

    if (userStatusIndex !== -1) {
      // Update only the "Invited" status to "Approved"
      deal.userStatuses[userStatusIndex].status = 'Approved';
      deal.userStatuses[userStatusIndex].proposalID = savedProposal._id; // Save the proposal ID
    } else {
      console.error('Invited status not found for influencerID:', influencerID);
      return res.status(404).json({ message: 'Invited status not found for influencer in userStatuses' });
    }

    // Save the updated deal
    await deal.save();

    return res.status(200).json({ message: 'Contract accepted, deal updated, and proposal created successfully', contract, proposal: savedProposal });
  } catch (error) {
    console.error('Error accepting contract:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
