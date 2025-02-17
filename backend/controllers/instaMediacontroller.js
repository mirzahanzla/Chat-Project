import jwt from 'jsonwebtoken'; 
import InstaMedia from '../models/instagramMedia.js';
import Brand from '../models/brands.js'; // Import the Brand model

export const getInstaMediaByUserId = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) return res.status(400).json({ message: 'Token is required' });

  try {
    // Decode the token to extract influencerID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id; // Assuming 'id' contains influencerID

    // Find InstaMedia documents where influencerID matches the extracted ID
    const instaMedia = await InstaMedia.find({ influencerID: userID }).lean();

    // Check if any documents were found
    if (instaMedia.length === 0) {
      return res.status(200).json({ message: 'No media found for the specified user', data: [] });
    }

    // Extract all brandIDs from the retrieved InstaMedia
    const brandIDs = instaMedia.map(media => media.brandID);

    // Find all Brands matching the extracted brandIDs (now using brandID field)
    const brands = await Brand.find({ brandID: { $in: brandIDs } }).lean();

    // Create a mapping of brandID to brand details for easy lookup
    const brandMap = brands.reduce((acc, brand) => {
      acc[brand.brandID] = {
        brandName: brand.brandName,
        brandImage: brand.brandImage
      };
      return acc;
    }, {});

    // Map through instaMedia to include required fields
    const mediaData = instaMedia.map(media => {
      const brandDetails = brandMap[media.brandID]; // Get brand details using the mapping
      return {
        PostImageID: media.instaPostID,
        PostImageSrc: media.postImageSrc,
        ProfileImage: brandDetails ? brandDetails.brandImage : null,
        name: brandDetails ? brandDetails.brandName : 'Unknown Brand',
        Likes: media.likes,
        Comments: media.comments
      };
    });

    // Send the retrieved media data with the required fields as JSON
    res.status(200).json({ data: mediaData });
  } catch (error) {
    console.error('Token verification or database query error:', error);
    res.status(500).json({ message: 'An error occurred while retrieving media', error: error.message });
  }
};

export const verifyLinks = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized access, token missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifying token, secret from env
    const brandID = decoded.id; 

    if (!brandID) {
      return res.status(401).json({ message: 'Invalid token or brand ID missing' });
    }

    const { contractID } = req.params;

    if (!contractID) {
      return res.status(400).json({ message: 'No contract ID provided' });
    }

    const instaMedia = await InstaMedia.find({
      contractID: contractID, 
      brandID: brandID 
    });

    // Handle cases where no media is found for the contract
    if (!instaMedia || instaMedia.length === 0) {
      return res.status(404).json({ message: 'No instaMedia found for the provided contract and brand' });
    }

    // Return the instaMedia collections
    return res.status(200).json(instaMedia);

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
