import jwt from 'jsonwebtoken';
import Brand from '../models/brands.js';
import Contract from '../models/contractModel.js';
import User from '../models/user.js';
import Deal from '../models/Deals.js';

export const checkDealsWithContracts = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decode the token and get brandID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const brandID = decoded.id;
    console.log("Brand ID: ", brandID);

    // Find brand by brandID
    const brand = await Brand.findOne({ brandID }).select('deals');
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    const { deals } = brand;
    if (!deals || deals.length === 0) {
      return res.status(404).json({ message: 'No deals found for this brand' });
    }

    // Extract all dealIDs from deals array
    const dealIDs = deals.map(deal => deal.dealID);

    // Find contracts associated with the dealIDs
    const contracts = await Contract.find({ dealID: { $in: dealIDs } });

    // Process each contract to add influencer details and deal details
    const enrichedContracts = await Promise.all(contracts.map(async contract => {
      // Fetch influencer details using influencerID
      const influencer = await User.findById(contract.influencerID).select('fullName photo');
      if (!influencer) {
        throw new Error('Influencer not found');
      }

      // Fetch deal details using dealID
      const deal = await Deal.findById(contract.dealID).select('category platform engagement_Rate followers');
      if (!deal) {
        throw new Error('Deal not found');
      }

      // Check if any milestone has a status of "Invited" or "Payment Pending"
      const hasExcludedStatus = contract.milestones.some(milestone =>
        milestone.status === 'Invited' || milestone.status === 'Payment Pending'
      );

      // Skip the contract if any milestone has "Invited" or "Payment Pending" status
      if (hasExcludedStatus) {
        return null; // Skip this contract
      }

      // Combine contract with influencer and deal data
      return {
        ...contract.toObject(),
        influencerName: influencer.fullName,
        influencerPhoto: influencer.photo,
        dealCategory: deal.category,
        dealPlatform: deal.platform,
        dealEngagementRate: deal.engagement_Rate,
        dealFollowers: deal.followers
      };
    }));

    // Remove null values from the enrichedContracts array (contracts with excluded milestones)
    const filteredContracts = enrichedContracts.filter(contract => contract !== null);

    res.status(200).json({ message: 'Contracts found', contracts: filteredContracts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
