import Contract from '../models/contractModel.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Deal from '../models/Deals.js';
import User from '../models/user.js';
import Notification from '../models/notifications.js';
import { sendEmail } from '../services/emailService.js';
import Brand from '../models/brands.js';
import Media from '../models/media.js';
import Transaction from '../models/transaction.js';

export const getUserContracts = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid', data: [] });
  }

  const token = authHeader.split(' ')[1];

  if (!token) return res.status(400).json({ message: 'Token is required', data: [] });

  try {
    // Decode the token to extract user ID
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    // Find all contracts for the user
    const contracts = await Contract.find({ influencerID: userID });

    // Check if contracts are found
    if (!contracts || contracts.length === 0) {
      return res.status(200).json({ message: 'You have no contracts yet', data: [] });
    }

    // Create a new array to store the modified contracts
    const modifiedContracts = await Promise.all(
      contracts.map(async (contract) => {
        const { dealID, milestones } = contract;

        // Check if there are milestones and get the last milestone
        const lastMilestone = milestones[milestones.length - 1];

        // If there is a last milestone and its status is "Invited", exclude the contract
        if (lastMilestone && lastMilestone.status === 'Invited') {
          return null; // Return null to filter this contract out
        }

        // Find the deal from the deals collection using dealID
        const deal = await Deal.findById(dealID);

        // Find the brand containing the dealID in its deals array
        const brand = await Brand.findOne({ 'deals.dealID': dealID });

        if (deal && brand) {
          // Append brandName, brandImage, and dealImage to the contract object
          return {
            ...contract._doc, // Spread contract data
            brandName: brand.brandName,
            brandImage: brand.brandImage,
            dealImage: deal.dealImage,
            milestones: milestones, // Keep the original milestones
          };
        }

        // If no brand or deal is found, return the contract as is
        return contract._doc;
      })
    );

    // Filter out null values (contracts that had the last milestone as invited)
    const filteredContracts = modifiedContracts.filter(contract => contract !== null);

    // Send the modified contracts in the response with a success message
    return res.status(200).json({ message: 'Contracts fetched successfully', data: filteredContracts });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return res.status(500).json({ message: 'Internal server error', data: [] });
  }
};

export const getContractByProposalID = async (req, res) => {
  const authHeader = req.headers.authorization; // Authorization token

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) return res.status(400).json({ message: 'Token is required' });

  try {
    // Decode the token to extract user ID
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    const { proposalID } = req.query; // Get proposalID from the request parameters

    if (!proposalID) {
      return res.status(400).json({ message: 'ProposalID is required', data:[] });
    }

    // Find the contract associated with the proposalID and the authenticated user
    const contracts = await Contract.find({ proposalID, influencerID: userID });

    // Check if contracts are found
    if (!contracts || contracts.length === 0) {
      return res.status(404).json({ message: 'You have not requested any deals for this proposalID', data: [] });
    }

    // Send the contracts in the response
    return res.status(200).json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const registerTransaction = async (estimatedReleaseDate, dealID, influencerID, amount, contractID) => {
  const transaction = new Transaction({
    estimatedReleaseDate,
    dealID,
    influencerID,
    amount,
    contractID,
  });

  try {
    await transaction.save(); // Save the transaction to the database
    return transaction; // Return the saved transaction
  } catch (error) {
    console.error('Error registering transaction:', error);
    throw new Error('Failed to register transaction');
  }
};

export const addContract = async (req, res) => {
 
  try {
    const authHeader = req.headers.authorization; // Authorization token

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { milestones, deliverables, proposalID, influencerIDs, dealID } = req.body;

    // Check if required fields are provided
    if (!milestones || !deliverables || !influencerIDs || !Array.isArray(influencerIDs) || influencerIDs.length < 1 || influencerIDs.length > 3 || !dealID) {
      return res.status(400).json({ message: 'Milestones, deliverables, 1 to 3 influencer IDs, and dealID are required.' });
    }

    // Find the deal by ID
    const deal = await Deal.findById(dealID);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Array to store created contracts
    const contracts = [];

    // Loop through influencerIDs and create a contract for each influencer
    for (const influencer of influencerIDs) {
      const newContract = new Contract({
        milestones,
        deliverables,
        influencerID: influencer, // Create a contract for each influencer
        proposalID: proposalID || undefined, // Make proposalID optional if not provided
        dealID: dealID
      });

      // Save each contract to the database within the session
      const savedContract = await newContract.save( );
      contracts.push(savedContract); // Add each saved contract to the array

      await registerTransaction(milestones.deadline, dealID, influencer, milestones.budget, savedContract._id);
      // Create and save notification for each influencer
      const message = `You have been invited to a new contract for deal ID: ${dealID}`;
      let notification = await Notification.findOne({ userID: influencer });
      if (notification) {
        notification.notifications.push({
          contractID: savedContract._id,
          message: message,
        });
      } else {
        notification = new Notification({
          userID: influencer,
          notifications: [{
            contractID: savedContract._id,
            message: message,
          }]
        });
      }
      await notification.save(); // Save the notification

      // Add contractID and status to deal's userStatuses for this influencer
      const userStatus = {
        userID: influencer, 
        status: "Invited",
        contractID: savedContract._id // Assign the saved contractID
      };
      deal.userStatuses.push(userStatus); // Push to userStatuses in deal

      // Find the user email using influencerID
      const user = await User.findById(influencer);
      const recipientEmail = user ? user.email : null;

      if (recipientEmail) {
        // Send email notification
        const subject = 'Contract Invitation Notification';
        const emailBody = `Dear ${user.fullName},\n\nYou have been invited to a new contract for deal ID: ${dealID}.\n\nPlease review the details in your dashboard.\n\nBest regards,\nInfluencer Harbor`;

        await sendEmail(recipientEmail, subject, emailBody); // Ensure email sending is outside the session as it's an external action
      }
    }

    // Save the updated deal with contractIDs in userStatuses within the session
    await deal.save();

    // Commit the transaction if everything is successful

    // Send response back with all created contracts
    res.status(201).json({
      message: 'Contracts successfully created and users invited',
      contracts, // Return the array of saved contracts
      deal // Return the updated deal with contractIDs
    });
  } catch (error) {
    console.error('Error details:', error);
    // If there is an error, abort the transaction
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: error.message || 'Server error, unable to create contracts' });
  } finally {
    // End the session
   
  }
};

export const getBrandContracts = async (req, res) => {
  try {
    const { dealID } = req.params;

    // Fetch contracts by dealID
    const contracts = await Contract.find({ dealID });

    if (!contracts || contracts.length === 0) {
      return res.status(200).json({ message: 'No contracts found for this deal ID.' });
    }

    // Array to hold the results
    const result = [];
    let totalSpendings = 0; // Initialize total spendings

    // Loop through contracts to extract influencer IDs, statuses, postLinks, and spendings
    for (const contract of contracts) {
      const lastMilestone = contract.milestones[contract.milestones.length - 1]; // Get the last milestone
      const influencerID = contract.influencerID; // Get influencer ID

      // Fetch user data for the influencer
      const user = await User.findById(influencerID, 'bio photo fullName age'); // Only fetch needed fields

      if (user) {
        // Extract postLinks from the last milestone
        const postLinks = lastMilestone.postLinks.map(link => ({
          instaPostID: link.instaPostID,
          _id: link._id
        }));

        // Check status and exclude spendings for certain statuses
        let spendings = 0;
        if (lastMilestone.status !== 'Payment Pending' && lastMilestone.status !== 'Invited') {
          spendings = lastMilestone.budget;
          totalSpendings += spendings; // Add to total spendings if status is not 'Payment Pending' or 'Invited'
        }

        result.push({
          contractID: contract._id,
          influencerID: user._id,
          status: lastMilestone.status, // Get status from the last milestone
          budget: lastMilestone.budget,
          bio: user.bio,
          photo: user.photo,
          fullName: user.fullName,
          age: user.age,
          postLinks: postLinks, // Add postLinks to the result
          spendings // Include spendings, or 0 if status is 'Payment Pending' or 'Invited'
        });
      }
    }

    res.set('Cache-Control', 'no-store');
    
    res.status(200).json({
      message: 'Contracts retrieved successfully.',
      contracts: result,
      totalSpendings // Include total spendings
    });
  } catch (error) {
    console.error('Error fetching brand contracts:', error);
    res.status(500).json({ message: error.message || 'Server error, unable to fetch contracts' });
  }
};

export const withdrawContract = async (req, res) => {
  try {
    const authHeader = req.headers.authorization; // Authorization token

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { contractID, dealID } = req.body;

    // Check if required fields are provided
    if (!contractID || !dealID) {
      return res.status(400).json({ message: 'ContractID and dealID are required.' });
    }

    // Find the contract by ID
    const contract = await Contract.findById(contractID);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Ensure the contract belongs to the provided deal
    if (contract.dealID.toString() !== dealID) {
      return res.status(403).json({ message: 'Contract does not belong to the specified deal' });
    }

    // Store the influencerID before deleting the contract
    const influencerID = contract.influencerID;

    // Delete the contract
    await Contract.findByIdAndDelete(contractID);

    // Update the deal by removing the userStatus associated with this contract's influencerID
    const deal = await Deal.findById(dealID);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Remove the corresponding influencer's userStatus from the deal
    deal.userStatuses = deal.userStatuses.filter(
      userStatus => userStatus.userID.toString() !== influencerID.toString()
    );

    await deal.save();

    // Get the influencer's details
    const influencer = await User.findById(influencerID);
    const influencerEmail = influencer ? influencer.email : null;

    // Get the brand's details using the decoded user ID
    const brand = await User.findById(decoded.id); // Fetch the brand's user info
    const brandEmail = brand ? brand.email : null;

    // Prepare notifications for the influencer and brand
    const influencerMessage = `Your contract for deal ${dealID} has been withdrawn.`;
    const brandMessage = `You have successfully withdrawn the contract for influencer ${influencer ? influencer.fullName : 'Unknown'} from deal ${dealID}.`;

    // Create or update notifications for the influencer
    let influencerNotification = await Notification.findOne({ userID: influencerID });
    if (influencerNotification) {
      influencerNotification.notifications.push({
        contractID: contractID,
        message: influencerMessage,
      });
    } else {
      influencerNotification = new Notification({
        userID: influencerID,
        notifications: [{ contractID, message: influencerMessage }]
      });
    }
    await influencerNotification.save();

    // Create or update notifications for the brand
    let brandNotification = await Notification.findOne({ userID: decoded.id });
    if (brandNotification) {
      brandNotification.notifications.push({
        contractID: contractID,
        message: brandMessage,
      });
    } else {
      brandNotification = new Notification({
        userID: decoded.id, // Use the brand's userID from the decoded token
        notifications: [{ contractID, message: brandMessage }]
      });
    }
    await brandNotification.save();

    // Send email to the influencer
    if (influencerEmail) {
      const influencerSubject = 'Contract Withdrawal Notification';
      const influencerEmailBody = `Dear ${influencer ? influencer.fullName : 'Influencer'},\n\nYour contract for the deal (ID: ${dealID}) has been withdrawn.\n\nBest regards,\nYour Company`;
      await sendEmail(influencerEmail, influencerSubject, influencerEmailBody);
    }

    // Send email to the brand
    if (brandEmail) {
      const brandSubject = 'Contract Withdrawal Confirmation';
      const brandEmailBody = `Dear Brand,\n\nYou have successfully withdrawn the contract for influencer ${influencer ? influencer.fullName : 'Unknown'} from deal (ID: ${dealID}).\n\nBest regards,\nYour Company`;
      await sendEmail(brandEmail, brandSubject, brandEmailBody);
    }

    // Send response back confirming the contract withdrawal
    res.status(200).json({
      message: 'Contract successfully withdrawn and notifications sent.',
      contractID,
      deal
    });
  } catch (error) {
    console.error('Error details:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: error.message || 'Server error, unable to withdraw contract' });
  }
};

export const getContractDetails = async (req, res) => {
  try {
    const authHeader = req.headers.authorization; // Authorization token

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { contractID } = req.params;

    // Check if contractID is provided
    if (!contractID) {
      return res.status(400).json({ message: 'ContractID is required.' });
    }

    // Find the contract by ID
    const contract = await Contract.findById(contractID);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const milestones = contract.milestones;
    if (!milestones || milestones.length === 0) {
      return res.status(404).json({ message: 'No milestones found for this contract' });
    }

    // Get the last milestone
    const lastMilestone = milestones[milestones.length - 1];

    // Send response back with the required contract details
    res.status(200).json({
      message: 'Contract details retrieved successfully',
      contract: {
        budget: lastMilestone.budget,
        posts: lastMilestone.posts,
        deadline: lastMilestone.deadline,
        status: lastMilestone.status,
        revisions: lastMilestone.revisions,
        contractID: contract._id
      },
    });
  } catch (error) {
    console.error('Error details:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: error.message || 'Server error, unable to retrieve contract details' });
  }
};

export const updateContractDetails = async (req, res) => {
  try {
    const authHeader = req.headers.authorization; // Authorization token

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { contractID } = req.params;

    // Check if contractID is provided
    if (!contractID) {
      return res.status(400).json({ message: 'ContractID is required.' });
    }

    // Find the contract by ID
    const contract = await Contract.findById(contractID);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const { budget, posts, deadline, revisions } = req.body;

    // Update the last milestone or create a new one if necessary
    const lastMilestone = contract.milestones[contract.milestones.length - 1];
    
    if (lastMilestone) {
      lastMilestone.budget = budget !== undefined ? budget : lastMilestone.budget;
      lastMilestone.posts = posts !== undefined ? posts : lastMilestone.posts;
      lastMilestone.deadline = deadline !== undefined ? deadline : lastMilestone.deadline;
      lastMilestone.revisions = revisions !== undefined ? revisions : lastMilestone.revisions;
    } else {
      return res.status(400).json({ message: 'No milestones available to update' });
    }

    // Save the updated contract
    await contract.save();

    res.status(200).json({
      message: 'Contract details updated successfully',
      contract: {
        budget: lastMilestone.budget,
        posts: lastMilestone.posts,
        deadline: lastMilestone.deadline,
        status: lastMilestone.status,
        revisions: lastMilestone.revisions,
      },
    });
  } catch (error) {
    console.error('Error details:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: error.message || 'Server error, unable to update contract details' });
  }
};

export const sendDraft = async (req, res) => {
  const authHeader = req.headers.authorization;

  // Check if the authorization header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  // Check if token exists
  if (!token) return res.status(400).json({ message: 'Token is required' });

  try {
    // Decode the token to extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    // Get contractID from the request body or params
    const { contractID } = req.params;

    // Find the contract by contractID and check if it belongs to the user
    const contract = await Contract.findOne({ _id: contractID, influencerID: userID });

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found or not authorized' });
    }

    // Find the last milestone in the contract's milestones array
    const lastMilestone = contract.milestones[contract.milestones.length - 1];

    if (!lastMilestone) {
      return res.status(400).json({ message: 'No milestones found in the contract' });
    }

    // Update the status of the last milestone to "Reviewing"
    lastMilestone.status = 'Reviewing';

    // Save the updated contract
    await contract.save();

    // Respond indicating that the milestone status has been updated
    return res.status(200).json({
      message: 'Milestone status updated to "Reviewing"',
    });
  } catch (error) {
    console.error('Error updating milestone and post links status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const sendPosts = async (req, res) => {
  try {
    const { postLinks } = req.body;

    // Ensure postLinks is provided and is an array
    if (!postLinks || !Array.isArray(postLinks)) {
      return res.status(400).json({ message: 'postLinks must be an array of objects with instaPostID.' });
    }

    // Extract instaPostID from the array of objects
    const mediaIds = postLinks.map(post => post.instaPostID);

    // Fetch media posts by instaPostIDs (no ObjectId conversion)
    const mediaPosts = await Media.find({ _id: { $in: mediaIds } });

    // Check if any media posts were found
    if (mediaPosts.length === 0) {
      return res.status(404).json({ message: 'No media posts found for the provided instaPostIDs.' });
    }

    res.status(200).json({
      message: 'Media posts retrieved successfully.',
      mediaPosts
    });
  } catch (error) {
    console.error('Error fetching media posts:', error);
    res.status(500).json({ message: error.message || 'Server error, unable to fetch media posts.' });
  }
};

export const approveContract = async (req, res) => {
 

  try {
    const { contractID } = req.params;

    if (!contractID) {
      return res.status(400).json({ message: 'Contract ID is required.' });
    }

    // Step 2: Find the contract by contractID
    const contract = await Contract.findById(contractID);

    if (!contract) {

      return res.status(404).json({ message: 'Contract not found.' });
    }

    // Step 3: Get the last milestone
    const milestones = contract.milestones;
    if (!milestones || milestones.length === 0) {

      return res.status(400).json({ message: 'No milestones found for this contract.' });
    }

    const lastMilestone = milestones[milestones.length - 1];

    // Step 4: Update the status of the last milestone to "Approved"
    lastMilestone.status = 'Approved';

    // Step 5: Find the user by influencerID from the contract
    const influencerID = contract.influencerID;
    const user = await User.findById(influencerID);

    if (!user) {
  
      return res.status(404).json({ message: 'User not found for the given influencer ID.' });
    }

    // Step 6: Update the user's earnings after deducting 10% platform fee
    const budgetToAdd = lastMilestone.budget * 0.9; // 90% of the last milestone budget
    user.earnings = (user.earnings || 0) + budgetToAdd;

 

    

    // Step 9: Send success response
    return res.status(200).json({
      message: 'Last milestone has been approved and user earnings updated.',
      milestone: lastMilestone,
    });
  } catch (error) {
 
    console.error('Error approving contract:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const approveCancelRequest = async (req, res) => {
  try {
    const { contractID } = req.params;

    if (!contractID) {
      return res.status(400).json({ message: 'Contract ID is required.' });
    }

    // Step 2: Find the contract by contractID
    const contract = await Contract.findById(contractID);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found.' });
    }

    // Step 3: Get the last milestone
    const milestones = contract.milestones;
    if (!milestones || milestones.length === 0) {
      return res.status(400).json({ message: 'No milestones found for this contract.' });
    }

    const lastMilestone = milestones[milestones.length - 1];

    // Step 4: Update the status of the last milestone to "Approved"
    lastMilestone.status = 'Cancelled';
    await contract.save(); // Save the updated contract

    // Step 5: Send success response
    return res.status(200).json({
      message: 'Your contract has been Cancelled.',
      milestone: lastMilestone,
    });
  } catch (error) {
    console.error('Error approving contract:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const rejectCancelRequest = async (req, res) => {
  try {
    const { contractID } = req.params;

    if (!contractID) {
      return res.status(400).json({ message: 'Contract ID is required.' });
    }

    // Step 2: Find the contract by contractID
    const contract = await Contract.findById(contractID);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found.' });
    }

    // Step 3: Get the last milestone
    const milestones = contract.milestones;
    if (!milestones || milestones.length === 0) {
      return res.status(400).json({ message: 'No milestones found for this contract.' });
    }

    const lastMilestone = milestones[milestones.length - 1];

    // Step 4: Update the status of the last milestone to "Approved"
    lastMilestone.status = 'Accepted';
    await contract.save(); // Save the updated contract

    // Step 5: Send success response
    return res.status(200).json({
      message: 'Your contract has been Cancelled.',
      milestone: lastMilestone,
    });
  } catch (error) {
    console.error('Error approving contract:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
