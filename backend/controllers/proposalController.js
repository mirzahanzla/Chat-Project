import Proposal from '../models/proposal.js';
import Deal from '../models/Deals.js';
import jwt from 'jsonwebtoken';
import Contract from '../models/contractModel.js';
import Notification from '../models/notifications.js';
import User from '../models/user.js';
import { sendEmail } from '../services/emailService.js';
import mongoose from 'mongoose';
import Transaction from '../models/transaction.js';
import { storage } from '../config/firebase.js'; // Import the storage configuration
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const addProposal = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Begin the transaction

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'Token is required' });

    let userID;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userID = decoded.id; // Extract user ID from the token
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Create a new proposal with the session
    const newProposal = new Proposal({
      budget: req.body.budget,
      posts: req.body.posts,
      revisions: req.body.revisions,
      deadline: req.body.deadline,
      coverLetter: req.body.coverLetter,
      link: req.body.link,
    });

    const savedProposal = await newProposal.save({ session });

    // Retrieve the proposal ID
    const proposalID = savedProposal._id;

    // Find and update the deal with the session
    const dealID = req.body.dealID;
    const deal = await Deal.findById(dealID).session(session);

    if (!deal) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Deal not found' });
    }

    const userStatus = deal.userStatuses.find(status => status.userID.toString() === userID);

    if (userStatus) {
      userStatus.status = 'Requested';
      userStatus.proposalID = proposalID;
    } else {
      deal.userStatuses.push({
        userID: userID,
        status: 'Requested',
        proposalID: proposalID
      });
    }

    await deal.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Proposal added and deal updated', proposal: savedProposal, deal });

  } catch (error) {
    console.error(error);

    // Roll back the transaction if there's an error
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

export const rejectProposal = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Begin the transaction

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'Token is required' });

    let brandID;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      brandID = decoded.id; // Extract the brandID from the decoded token
    } catch (err) {
      return res.status(403).json({ message: 'Token is invalid or expired' });
    }

    const { dealID, userID } = req.body;

    if (!dealID || !userID) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Deal ID and User ID are required' });
    }

    // Find and update the deal with the session
    const deal = await Deal.findById(dealID).session(session);
    if (!deal) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Find the user's status in the userStatuses array
    const userStatus = deal.userStatuses.find(status => status.userID.toString() === userID);
    if (!userStatus) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User status not found for this deal' });
    }

    // Update the status to 'Rejected'
    userStatus.status = 'Rejected';
    await deal.save({ session }); // Save the updated deal with the session

    // Find the influencer's email
    const influencer = await User.findById(userID).session(session);
    if (!influencer) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Influencer not found' });
    }

    // Prepare notification message
    const notificationMessage = `Your Proposal for the deal (ID: ${dealID}) has been rejected.`;

    // Update or create the notification with the session
    const notification = await Notification.findOne({ userID: influencer._id }).session(session);
    if (notification) {
      notification.notifications.push({
        contractID: dealID,
        message: notificationMessage,
      });
      await notification.save({ session });
    } else {
      const newNotification = new Notification({
        userID: influencer._id,
        notifications: [{
          contractID: dealID,
          message: notificationMessage,
        }],
      });
      await newNotification.save({ session });
    }

    // Send email to the influencer
    const influencerSubject = 'Contract Withdrawal Notification';
    const influencerEmailBody = `Dear ${influencer.fullName},\n\n${notificationMessage}\n\nBest regards,\nYour Company`;

    await sendEmail(influencer.email, influencerSubject, influencerEmailBody);

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Proposal rejected successfully', deal });

  } catch (error) {
    console.error('Error rejecting proposal:', error);

    // Roll back the transaction in case of error
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

const registerTransaction = async (estimatedReleaseDate, dealID, influencerID, amount, contractID, imgURL, session) => {
  const transaction = new Transaction({
    estimatedReleaseDate,
    dealID,
    influencerID,
    amount,
    contractID,
    status: "Payment Processing",
    transactionImage: imgURL,
  });

  try {
    await transaction.save({ session }); // Pass session for transaction context
    return transaction;
  } catch (error) {
    console.error('Error registering transaction:', error);
    throw new Error('Failed to register transaction');
  }
};

export const approveProposal = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'Token is required' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ message: 'Token verification failed', error: err.message });
    }

    const { dealID, userID } = req.body;
    const screenshotFile = req.file;

    if (!dealID || !userID) {
      return res.status(400).json({ message: 'Deal ID and User ID are required' });
    }

    if (!screenshotFile) {
      return res.status(400).json({ message: "Screenshot is required." });
    }

    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedFileTypes.includes(screenshotFile.mimetype)) {
      return res.status(400).json({ message: "Only image files (jpeg, png, gif) are allowed." });
    }

    const imageRef = ref(storage, `transactions/${Date.now()}_${screenshotFile.originalname}`);
    const uploadResult = await uploadBytes(imageRef, screenshotFile.buffer);
    const imgURL = await getDownloadURL(uploadResult.ref);

    const deal = await Deal.findById(dealID).session(session);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    const userStatus = deal.userStatuses.find(status => status.userID.toString() === userID);
    if (!userStatus) {
      return res.status(404).json({ message: 'User status not found for this deal' });
    }

    userStatus.status = 'Approved';
    await deal.save({ session });

    const proposalID = userStatus.proposalID;
    const proposal = await Proposal.findById(proposalID).session(session);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    const milestone = [{
      deadline: proposal.deadline,
      revisions: proposal.revisions,
      posts: proposal.posts,
      budget: proposal.budget,
      status: 'Payment Processing'
    }];

    const newContract = new Contract({
      milestones: milestone,
      deliverables: deal.taskDes,
      influencerID: userID,
      proposalID: proposalID,
      dealID: dealID
    });

    await newContract.save({ session });

    const influencer = await User.findById(userID).session(session);
    if (influencer) {
      const notificationMessage = `Your proposal (ID: ${proposalID}) has been approved.`;
      const notification = await Notification.findOne({ userID: influencer._id }).session(session);

      if (notification) {
        notification.notifications.push({
          contractID: newContract._id,
          message: notificationMessage
        });
        await notification.save({ session });
      } else {
        const newNotification = new Notification({
          userID: influencer._id,
          notifications: [{ contractID: newContract._id, message: notificationMessage }]
        });
        await newNotification.save({ session });
      }

      // Call registerTransaction with session
      await registerTransaction(proposal.deadline, dealID, influencer._id, proposal.budget, newContract._id, imgURL, session);

      const influencerEmail = influencer.email;
      if (influencerEmail) {
        const influencerSubject = 'Proposal Approval Notification';
        const influencerEmailBody = `Dear ${influencer.fullName || 'Influencer'},\n\nYour proposal (ID: ${proposalID}) has been approved.\n\nBest regards,\nYour Company`;
        await sendEmail(influencerEmail, influencerSubject, influencerEmailBody);
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Proposal approved and contract created successfully', deal, contract: newContract });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error approving proposal:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

export const proposalDetails = async (req, res) => {
  try {
    const { dealID, userID } = req.query; // Get dealID and userID from the URL parameters

    // Ensure both dealID and userID are provided
    if (!dealID || !userID) {
      return res.status(400).json({ message: 'Deal ID and User ID are required' });
    }

    // Find the deal by dealID
    const deal = await Deal.findById(dealID);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Find the user's status in the userStatuses array
    const userStatus = deal.userStatuses.find(status => status.userID.toString() === userID);
    if (!userStatus) {
      return res.status(404).json({ message: 'User status not found for this deal' });
    }

    const proposalID = userStatus.proposalID;

    // Find the proposal by proposalID
    const proposal = await Proposal.findById(proposalID);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Extract the necessary fields from the proposal
    const { budget, revisions, posts, deadline } = proposal;

    // Send the proposal details back in the response
    res.status(200).json({
      message: "Proposal Details",
      proposal: {
        budget,
        posts,
        deadline,
        revisions,
      }
    });
  } catch (error) {
    console.error('Error fetching proposal details:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

export const deleteProposal = async (req, res) => {
  try {
    // Extract authorization header and get userID from the token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in your environment variables
    const userID = decodedToken.id;

    // Get dealID from the request parameters
    const { dealID } = req.params;

    // Find the deal by ID
    const deal = await Deal.findById(dealID);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Find the userStatus entry matching the userID and get the proposalID
    const userStatus = deal.userStatuses.find(status => 
      status.userID.toString() === userID
    );

    if (!userStatus || !userStatus.proposalID) {
      return res.status(404).json({ message: 'Proposal not found for this user' });
    }

    const proposalID = userStatus.proposalID; // Store the proposalID

    // Remove the proposal object from userStatuses array
    deal.userStatuses = deal.userStatuses.filter(status => 
      status.proposalID.toString() !== proposalID.toString()
    );

    // Save the updated deal
    await deal.save();

    // Delete the proposal from the Proposal collection
    await Proposal.findByIdAndDelete(proposalID);

    return res.status(200).json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
