import jwt from 'jsonwebtoken';
import PaymentAccount from '../models/paymentAccount.js'; // Import your PaymentAccount model
import User from '../models/user.js'; // Assuming you need to reference the User model
import WithdrawalRequest from '../models//withdrawalRequest.js'; // Import your WithdrawalRequest model
import mongoose from 'mongoose';

export const addPaymentAccount = async (req, res) => {
  const authHeader = req.headers.authorization;

  // Check for authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decode the token to get user information (e.g., user ID)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Assuming the user ID is stored in the token

    // Get the account data from the request body
    const { paymentAccount, accountHolderName, bankName } = req.body;

    // Validate input data
    if (!paymentAccount || !accountHolderName || !bankName) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new payment account entry
    const newPaymentAccount = new PaymentAccount({
      user: userId, // Associate with the user
      paymentAccount,
      accountHolderName,
      bankName,
    });

    // Save the payment account to the database
    await newPaymentAccount.save();

    return res.status(201).json({ message: 'Payment account added successfully.', newPaymentAccount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPaymentAccounts = async (req, res) => {
  const authHeader = req.headers.authorization;

  // Check for authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decode the token to get user information (e.g., user ID)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Assuming the user ID is stored in the token

    // Find all payment accounts for the user
    const accounts = await PaymentAccount.find({ user: userId });

    if (accounts.length === 0) {
      return res.status(404).json({ message: 'No payment accounts found for this user.' });
    }

    // Return the found accounts
    return res.status(200).json({ accounts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addWithdrawalRequest = async (req, res) => {
  const authHeader = req.headers.authorization;

  // Check for authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Decode the token to get user information (e.g., user ID)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Assuming the user ID is stored in the token

    // Extract withdrawal details from the request body
    const { accountID, amount } = req.body;

    // Validate the request body
    if (!accountID || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid account ID and amount are required.' });
    }

    // Find the user to check current earnings using _id
    const user = await User.findOne({ _id: userId }).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if user has sufficient earnings
    if (user.earnings < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Insufficient earnings.' });
    }

    // Deduct amount from user's earnings
    user.earnings -= amount;
    await user.save({ session });

    // Create a new withdrawal request
    const newWithdrawalRequest = new WithdrawalRequest({
      accountID,
      userID: userId, // Associate the withdrawal request with the user
      amount,
    });

    // Save the withdrawal request to the database
    await newWithdrawalRequest.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Respond with success message
    res.status(201).json({ message: 'Withdrawal request created successfully.', withdrawalRequest: newWithdrawalRequest });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the withdrawal request.' });
  }
};