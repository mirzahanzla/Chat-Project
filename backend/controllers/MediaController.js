import Media from '../models/media.js';
import Contract from '../models/contractModel.js';
import { storage } from '../config/firebase.js'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import InstaMedia from '../models/instagramMedia.js';
import Brand from '../models/brands.js';

export const uploadMedia = async (req, res) => {
  const { description, contractID } = req.body;
  const mediaFile = req.file;

  try {
    // Validate file type
    if (!mediaFile.mimetype.startsWith('image/') && !mediaFile.mimetype.startsWith('video/')) {
      console.error('Invalid file type. File type:', mediaFile.mimetype);
      return res.status(400).json({ message: 'Invalid file type. Please upload an image or video.' });
    }

    // Validate file size (max 10MB for example)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (mediaFile.size > maxSize) {
      console.error('File size exceeds limit. File size:', mediaFile.size);
      return res.status(400).json({ message: 'File size exceeds the 10MB limit.' });
    }

    // Handle the image/video upload to Firebase Storage
    const mediaRef = ref(storage, `media/${Date.now()}_${mediaFile.originalname}`);
    await uploadBytes(mediaRef, mediaFile.buffer);
    const mediaURL = await getDownloadURL(mediaRef);

    // Create a new media entry in MongoDB
    const newMedia = new Media({
      status: 'draft',
      imageLink: mediaURL,
      description,
    });

    const savedMedia = await newMedia.save();

    // Find the contract and update postLinks
    const updatedContract = await Contract.findOneAndUpdate(
      { _id: contractID, 'milestones.postLinks.instaPostID': { $ne: savedMedia._id } }, // Ensure the media ID is not already present
      { 
        $push: { 'milestones.$[milestone].postLinks': { instaPostID: savedMedia._id } },
        $set: { 'milestones.$[milestone].status': 'Draft' }
      },
      { 
        arrayFilters: [{ 'milestone.postLinks': { $exists: true } }],
        new: true
      }
    );

    if (!updatedContract) {
      console.error('Contract not found or media ID already exists in postLinks:', contractID);
      return res.status(404).json({ message: 'Contract not found or media already exists in postLinks.' });
    }

    res.status(201).json({ message: 'Media uploaded and saved successfully', media: savedMedia });
  } catch (error) {
    console.error('Upload media error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMedia = async (req, res) => {
  const { contractID } = req.query;

  try {
    // Validate contractID
    if (!contractID) {
      return res.status(400).json({ message: 'Contract ID is required.' });
    }

    // Find the contract by ID
    const contract = await Contract.findById(contractID).exec();
    
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found.' });
    }

    // Extract instaPostID from postLinks within milestones
    const instaPostIDs = contract.milestones.flatMap(milestone => 
      milestone.postLinks.map(link => link.instaPostID)
    );

    if (instaPostIDs.length === 0) {
      return res.status(200).json({ message: 'No media uploaded yet.' });
    }

    // Fetch media from the Media collection where _id matches instaPostID
    const media = await Media.find({ _id: { $in: instaPostIDs } }).exec();

    res.status(200).json(media);
  } catch (error) {
    console.error('Error fetching media:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const approveMedia = async (req, res) => {
  const { postID } = req.params;

  try {
    // Find the media document by postID and update its status
    const media = await Media.findByIdAndUpdate(
      postID,
      { status: 'Approved' },
      { new: true } // Return the updated document
    );

    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Find the contract that includes this media post by matching instaPostID
    const contract = await Contract.findOne({
      'milestones.postLinks.instaPostID': postID,
    });

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Get the last milestone from the milestones array
    const lastMilestone = contract.milestones[contract.milestones.length - 1];

    // Check if the last milestone includes the current postID
    if (lastMilestone.postLinks.some(link => link.instaPostID.toString() === postID)) {
      // Get all linked media for this milestone
      const linkedMediaIds = lastMilestone.postLinks.map(link => link.instaPostID);
      const linkedMedia = await Media.find({ _id: { $in: linkedMediaIds } });

      // Check if all linked media are approved
      const allApproved = linkedMedia.every(linkedMedia => linkedMedia.status === 'Approved');

      // If all linked media are approved, update the milestone status
      if (allApproved) {
        lastMilestone.status = 'Awaiting InstaLink';
        await contract.save();
      }
    }

    res.status(200).json({ message: 'Media approved successfully', media });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const instructMedia = async (req, res) => {
  const { postID } = req.params;
  const { instructions } = req.body;

  try {
    // Find the media document by postID and update its status to "Instructed"
    const media = await Media.findByIdAndUpdate(
      postID,
      { 
        status: 'Instructed',
        description: instructions 
      },
      { new: true } // Return the updated document
    );

    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Find the contract that includes this media post by matching instaPostID
    const contract = await Contract.findOne({
      'milestones.postLinks.instaPostID': postID,
    });

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Get the last milestone from the milestones array
    const lastMilestone = contract.milestones[contract.milestones.length - 1];

    // Check if the last milestone includes the current postID
    if (lastMilestone.postLinks.some(link => link.instaPostID.toString() === postID)) {
      // Update the milestone status to "Instructed"
      lastMilestone.status = 'Instructed';
      await contract.save();
    }

    res.status(200).json({ message: 'Media instructed successfully', media });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const editMedia = async (req, res) => {
  const { description, mediaID } = req.body; // Include mediaID to identify which media to edit
  const mediaFile = req.file;

  try {
    // Validate the input
    if (!description || !mediaID) {
      return res.status(400).json({ message: 'Description and media ID are required.' });
    }

    // Find existing media entry
    const existingMedia = await Media.findById(mediaID);
    if (!existingMedia) {
      return res.status(404).json({ message: 'Media not found.' });
    }

    // Update the description
    existingMedia.description = description;
    // Change the status to "Draft"
    existingMedia.status = 'draft';

    // Check if a new file is provided
    if (mediaFile) {
      // Validate file type
      if (!mediaFile.mimetype.startsWith('image/') && !mediaFile.mimetype.startsWith('video/')) {
        console.error('Invalid file type. File type:', mediaFile.mimetype);
        return res.status(400).json({ message: 'Invalid file type. Please upload an image or video.' });
      }

      // Validate file size (max 10MB for example)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (mediaFile.size > maxSize) {
        console.error('File size exceeds limit. File size:', mediaFile.size);
        return res.status(400).json({ message: 'File size exceeds the 10MB limit.' });
      }

      // Handle the new image/video upload to Firebase Storage
      const newMediaRef = ref(storage, `media/${Date.now()}_${mediaFile.originalname}`);
      await uploadBytes(newMediaRef, mediaFile.buffer);
      const mediaURL = await getDownloadURL(newMediaRef);

      // Update the existing media document with the new media link
      existingMedia.imageLink = mediaURL; // Update to the new link
    }

    // Save the updated media entry
    await existingMedia.save();

    res.status(200).json({ message: 'Media updated successfully', media: existingMedia });
  } catch (error) {
    console.error('Edit media error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const submitInstaLinks = async (req, res) => {
  try {
    const { contractID, links } = req.body;

    // Validate input
    if (!contractID || !Array.isArray(links) || links.length === 0) {
      return res.status(400).json({ error: 'Invalid input. Provide contractID and an array of links.' });
    }

    // Step 1: Find the contract to get influencerID and dealID
    const contract = await Contract.findById(contractID).populate('influencerID dealID');
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found.' });
    }

    const influencerID = contract.influencerID; // Get influencerID from the contract
    const dealID = contract.dealID; // Get dealID from the contract

    // Step 2: Find the brand using dealID
    const brand = await Brand.findOne({ 'deals.dealID': dealID });
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found for the given dealID.' });
    }

    const brandID = brand.brandID; // Get brandID from the brand

    // Step 3: Process each link and save InstaMedia entries
    const instaMediaEntries = await Promise.all(links.map(async (link) => {
      const instaPostID = extractInstaPostID(link); // Extract instaPostID from the link

      if (!instaPostID) {
        return null; // Skip if postID extraction fails
      }

      // Create a new InstaMedia document
      const instaMediaEntry = new InstaMedia({
        postImageSrc: link,
        instaPostID: instaPostID,
        contractID: contractID, // Ensure contractID is an ObjectId
        brandID: brandID, // Set the retrieved brandID
        influencerID: influencerID, // Set the retrieved influencerID
      });

      // Save the document to the database
      return await instaMediaEntry.save();
    }));

    // Step 4: Filter out any null entries (failed extractions)
    const savedEntries = instaMediaEntries.filter(entry => entry !== null);

    // Step 5: Update the last milestone status
    const lastMilestoneIndex = contract.milestones.length - 1;
    if (lastMilestoneIndex >= 0) {
      contract.milestones[lastMilestoneIndex].status = 'LinkSubmitted'; // Update status
      await contract.save(); // Save the updated contract
    }

    // Step 6: Return the response
    return res.status(201).json({ message: 'Instagram media links saved successfully.', data: savedEntries });
  } catch (error) {
    console.error('Error saving Instagram media links:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Function to extract instaPostID from the link
const extractInstaPostID = (link) => {
  const regex = /\/p\/([^\/]+)/;
  const match = link.match(regex);
  return match ? match[1] : null; // Return the postID or null if not found
};
