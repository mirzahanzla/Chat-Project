import CancellationRequest from '../models/cancellationRequest.js';
import Contract from '../models/contractModel.js';
import Notification from '../models/notifications.js';
import Brand from '../models/brands.js';
import { sendEmail } from '../services/emailService.js';
import User from '../models/user.js';

// Function to handle the cancellation request
export const cancelContractRequest = async (req, res) => {
    try {
        const { contractID } = req.params;

        // Step 1: Add a new cancellation request
        const cancellationData = new CancellationRequest({
            contractID: contractID
        });
        await cancellationData.save();

        // Step 2: Find the contract by contractID
        const contract = await Contract.findById(contractID);
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        // Step 3: Update the status of the last milestone in the contract's milestone array
        const lastMilestoneIndex = contract.milestones.length - 1;
        if (lastMilestoneIndex >= 0) {
            contract.milestones[lastMilestoneIndex].status = 'cancelRequest';
        } else {
            return res.status(400).json({ message: 'No milestones available to update' });
        }

        // Save the updated contract
        await contract.save();

        // Step 4: Find the brand name using contract.dealID
        const brand = await Brand.findOne({ deals: { $elemMatch: { dealID: contract.dealID } } });
        const brandName = brand ? brand.brandName : 'Unknown Brand'; // Access brandName here

        const influencerID = contract.influencerID;

        // Step 5: Create or update a notification for the cancellation request
        const message = `You have a new cancellation request from ${brandName}`;

        // Find the notification document for the given influencerID
        let notification = await Notification.findOne({ influencerID });

        if (notification) {
            // If notification document exists, push the new notification to the notifications array
            notification.notifications.push({
                contractID: contractID,
                message: message,
            });
        } else {
            // If notification document doesn't exist, create a new one
            notification = new Notification({
                userID: influencerID,
                notifications: [{
                    contractID: contractID,
                    message: message,
                }]
            });
        }

        // Save the notification
        await notification.save();

        // Step 6: Find the user email using influencerID
        const user = await User.findById(influencerID); // Get the user by influencerID
        const recipientEmail = user ? user.email : null; // Access the email property
        if (!recipientEmail) {
            return res.status(404).json({ message: 'User email not found' });
        }

        // Step 7: Send an email notification
        const subject = 'Cancellation Request Notification';
        const emailBody = `Dear ${user.fullName},\n\nWe would like to inform you that a cancellation request has been submitted by ${brandName} regarding your ongoing contract (Contract ID: ${contractID}).\n\nPlease review the details of the contract and the request in your dashboard at your earliest convenience. If you have any questions or need further clarification, feel free to reach out to our support team.\n\nThank you for your attention to this matter.\n\nBest regards,\nInfluencer Harbor`;

        await sendEmail(recipientEmail, subject, emailBody);

        // Respond with success
        res.status(200).json({ message: 'Cancellation request created and contract milestone updated' });

    } catch (error) {
        console.error('Error cancelling contract:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
