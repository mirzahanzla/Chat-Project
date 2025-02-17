import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Brand from '../models/brands.js'; // Import your Brand model

export const searchInfluencers = async (req, res) => {
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
    
    if (!user || (user.userType !== 'Brand' && user.userType !== 'brand')) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    

    // Fetch the brand's network
    const brand = await Brand.findOne({ brandID: userID }).select('network').lean();


    // Initialize an empty array for influencer IDs
    let networkIDs = [];

    // Check if the brand exists and extract influencer IDs from the network
    if (brand) {
      networkIDs = brand.network.map(influencer => influencer.influencerID.toString());
    }

    // Check for a search query
    const query = req.query.query; // Assuming the query comes from req.query
    let influencers;

    if (!query) {
      // No query provided, fetch the first 20 influencers
      influencers = await User.find({ userType: 'influencer', verified: true })  // Only verified influencers
        .select('photo _id fullName followers bio userName')
        .lean()
        .limit(20) // Limit to 20 influencers
        .exec();

        console.log("influncer are ")
        console.log(influencers)
    } else {
      // Query provided, filter influencers based on query
      const regex = new RegExp(query, 'i'); // Case-insensitive regex
      influencers = await User.find({
        userType: 'influencer',
        verified: true,  // Only verified influencers
        $or: [{ fullName: regex }, { userName: regex }]
      })
        .select('photo _id fullName followers bio userName')
        .lean()
        .exec();
    }

    console.log("user name is")
    console.log(influencers)
    // Add status field to each influencer
    const influencersWithStatus = influencers.map(influencer => ({
      ...influencer,
      status: networkIDs.includes(influencer._id.toString()) ? 'inNetwork' : 'notInNetwork',
    }));


    // Set headers to prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Expires', '0');
    res.setHeader('Pragma', 'no-cache');

    // Return the list of verified influencers with status
    res.status(200).json({ influencers: influencersWithStatus });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const removeFromNetwork = async (req, res) => {
  const authHeader = req.headers.authorization; // Authorization token

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token and get the decoded ID
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const brandID = decoded.id;

    // Extract influencerID from the request body
    const { influencerID } = req.body;

    if (!influencerID) {
      return res.status(400).json({ message: 'InfluencerID is required' });
    }

    // Find the brand by brandID
    const brand = await Brand.findOne({ brandID: brandID }).exec();

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Check if the influencer is in the network
    const influencerIndex = brand.network.findIndex(entry => entry.influencerID.equals(influencerID));
    if (influencerIndex === -1) {
      return res.status(400).json({ message: 'Influencer is not in the network' });
    }

    // Remove the influencer from the network
    brand.network.splice(influencerIndex, 1);
    await brand.save();

    // Return success message
    res.status(200).json({ message: 'Influencer removed from network successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addToNetwork = async (req, res) => {
  const authHeader = req.headers.authorization; // Authorization token

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token and get the decoded ID
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const brandID = decoded.id;

    // Extract data from the request body
    const { influencerID, name } = req.body;

    if (!influencerID || !name) {
      return res.status(400).json({ message: 'InfluencerID and name are required' });
    }

    // Find the brand by brandID
    const brand = await Brand.findOne({ brandID: brandID }).exec();

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Check if the influencer is already in the network
    const isAlreadyInNetwork = brand.network.some(entry => entry.influencerID.equals(influencerID));
    if (isAlreadyInNetwork) {
      return res.status(400).json({ message: 'Influencer is already in the network' });
    }

    // Add the influencer to the network
    brand.network.push({ influencerID, name });
    await brand.save();

    // Return success message
    res.status(200).json({ message: 'Influencer added to network successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getNetwork = async (req, res) => {
  const authHeader = req.headers.authorization; // Authorization token

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token and get the decoded ID
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const brandID = decoded.id;

    // Find the brand by brandID
    const brand = await Brand.findOne({ brandID: brandID }).exec();

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Return only the network of influencers
    res.status(200).json({ network: brand.network });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const networkInfluencers = async (req, res) => {
  const authHeader = req.headers.authorization; // Authorization token

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token and get userID
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;
    console.log("User ID is: ", userID);

    // Check if the user is valid and of correct type (e.g., 'Brand')
    const user = await User.findById(userID).select('fullName userType');
    // if (!user || user.userType !== 'Brand') {
    //   return res.status(403).json({ message: 'Unauthorized access' });
    // }

    // Fetch the brand's network
    const brand = await Brand.findOne({ brandID: userID }).select('network').lean();

    // If brand has no network, return an empty list
    if (!brand || brand.network.length === 0) {
      return res.status(200).json({ influencers: [] });
    }

    // Extract influencer IDs from the network
    const networkIDs = brand.network.map(influencer => influencer.influencerID.toString());

    // Fetch influencers from the network based on influencer IDs
    const networkInfluencers = await User.find({
      _id: { $in: networkIDs },
      userType: 'influencer',
    })
      .select('fullName userName photo')
      .lean()
      .exec();

    // Set headers to prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Expires', '0');
    res.setHeader('Pragma', 'no-cache');

    // Return the list of influencers in the network
    res.status(200).json({ influencers: networkInfluencers });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};