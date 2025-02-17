import jwt from 'jsonwebtoken';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Deal from '../models/Deals.js'; // Adjust path as necessary
import Brand from '../models/brands.js'; // Adjust path as necessary
import User from '../models/user.js'; // Adjust path as necessary
import { storage } from '../config/firebase.js';

export const addCampaign = async (req, res) => {
  const authHeader = req.headers.authorization; // Authorization token

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token and get userID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    // Find user by ID
    const user = await User.findById(userID).select('fullName photo userType id');
    console.log("User is")
    console.log(user)
    if (!user || (user.userType !== 'Brand' && user.userType !== 'brand')) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Check if there is an image to upload
    let dealImageUrl = '';
    if (req.file) {
      // Upload image to Firebase
      const file = req.file;
      const fileName = `deals/${Date.now()}_${file.originalname}`;
      const fileRef = ref(storage, fileName);

      await uploadBytes(fileRef, file.buffer, {
        contentType: file.mimetype
      });

      dealImageUrl = await getDownloadURL(fileRef);
    }

    // Create a new deal
    const deal = new Deal({
      dealImage: dealImageUrl,
      campaignDes: req.body.campaignDes,
      taskDes: req.body.taskDes,
      category: req.body.category,
      platform: req.body.platform,
      followers: req.body.followers,
      engagement_Rate: req.body.engagementRate,
      budget: req.body.budget,
    });

    const savedDeal = await deal.save();

    // Find the existing brand
    const brand = await Brand.findOne({ brandName: user.fullName });
    if (brand) {
      // Add the new deal to the existing brand
      brand.deals.push({ dealID: savedDeal._id });
      await brand.save();
    } else {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.status(201).json({ message: 'Campaign created successfully', deal: savedDeal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCampaigns = async (req, res) => {
  const authHeader = req.headers.authorization; // Authorization token

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token and get userID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    // Find user by ID
    const user = await User.findById(userID).select('fullName userType');
    if (!user || user.userType !== 'Brand') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Find the brand by fullName
    const brand = await Brand.findOne({ brandName: user.fullName });
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Retrieve the deal IDs from the brand document
    const dealIDs = brand.deals.map(deal => deal.dealID);

    // Find all deals based on the retrieved deal IDs
    const deals = await Deal.find({ _id: { $in: dealIDs } });

    // Return the deals
    res.status(200).json({ deals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getInfluencers = async (req, res) => {
  
  const authHeader = req.headers.authorization; // Authorization token

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token and get userID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    // Check if the user is valid and of correct type (e.g., 'Brand')
    const user = await User.findById(userID).select('fullName userType');
    if (!user || user.userType !== 'Brand') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const { influencerIDs } = req.body; // Extract the array of influencer user IDs from the request body
    if (!influencerIDs || !Array.isArray(influencerIDs)) {
      return res.status(400).json({ message: 'Invalid influencer IDs provided' });
    }

    // Fetch user data (photo, fullName, age) for each influencer
    const influencers = await User.find({ _id: { $in: influencerIDs } }).select('photo fullName age _id bio').lean();

    if (!influencers.length) {
      return res.status(404).json({ message: 'No influencers found' });
    }

    // Return the list of influencers
    res.status(200).json({ influencers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};