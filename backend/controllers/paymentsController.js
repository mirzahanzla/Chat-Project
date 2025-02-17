import Transaction from "../models/transaction.js";
import User from "../models/user.js";
import { storage } from '../config/firebase.js'; // Import the storage configuration
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import required functions from Firebase SDK
import Contract from '../models/contractModel.js';

export const getTransactions = async (req, res) => {
    const { dealID } = req.params; 

    try {
        const transactions = await Transaction.find({ dealID: dealID });

        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found for this deal ID." });
        }

        const transactionsWithInfluencers = await Promise.all(transactions.map(async (transaction) => {
            const influencer = await User.findById(transaction.influencerID).select('fullName photo');
            return {
                ...transaction.toObject(),
                influencer: influencer ? influencer : { fullName: "Unknown", photo: null }
            };
        }));

        // Respond with the transactions including influencer details
        return res.status(200).json(transactionsWithInfluencers);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const uploadTransactionProof = async (req, res) => {
    const { contractID } = req.body; // Contract ID from the request body
    const screenshotFile = req.file; // File uploaded via Multer

    try {
        // Find the transaction associated with the contractID
        const transaction = await Transaction.findOne({ contractID: contractID });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found for the given contract ID." });
        }

        if (!screenshotFile) {
            return res.status(400).json({ message: "Screenshot is required." });
        }

        // File validation (optional): Ensure only images are allowed
        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedFileTypes.includes(screenshotFile.mimetype)) {
            return res.status(400).json({ message: "Only image files (jpeg, png, gif) are allowed." });
        }

        // Create a storage reference for the image
        const imageRef = ref(storage, `transactions/${Date.now()}_${screenshotFile.originalname}`);

        // Upload the image to Firebase Storage
        await uploadBytes(imageRef, screenshotFile.buffer).then(async (snapshot) => {
            // Get the download URL of the uploaded image
            const imageUrl = await getDownloadURL(snapshot.ref);

            // Update the transaction with the image URL and set the status to "Payment Processing"
            transaction.transactionImage = imageUrl;
            transaction.status = "Payment Processing"; // Update transaction status

            // Find the contract by contractID
            const contract = await Contract.findById(contractID);
            if (!contract) {
                return res.status(404).json({ message: "Contract not found." });
            }

            // Assuming milestones is an array in the contract document
            const lastMilestone = contract.milestones[contract.milestones.length - 1];
            if (lastMilestone) {
                lastMilestone.status = "Payment Processing"; // Update last milestone status
            }

            // Save the updated transaction and contract
            await transaction.save();
            await contract.save(); // Save the updated contract with the new milestone status

            return res.status(200).json({ message: "Screenshot uploaded successfully.", transaction });
        });
    } catch (error) {
        console.error("Error uploading transaction proof:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
