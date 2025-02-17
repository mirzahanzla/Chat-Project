import express from 'express';
import multer from 'multer';
import { addCampaign, getCampaigns, getInfluencers } from '../controllers/campaignController.js'; // Make sure the path is correct
import { searchInfluencers, addToNetwork, getNetwork, removeFromNetwork, networkInfluencers } from '../controllers/searchInfluencers.js'
import { addContract, getBrandContracts, withdrawContract, getContractDetails,
     updateContractDetails, sendPosts, approveContract } from '../controllers/contractController.js';
import { rejectProposal, approveProposal, proposalDetails } from '../controllers/proposalController.js';
import { cancelContractRequest } from '../controllers/cancellationRequestController.js';
import { getReport } from '../controllers/reportController.js';
import { getPredicitedReport } from '../controllers/predicter.js';
import { checkDealsWithContracts } from '../controllers/BrandContracts.js';
import { createQuery } from '../controllers/queryController.js';
import { approveMedia, instructMedia } from '../controllers/MediaController.js';
import { verifyLinks } from '../controllers/instaMediacontroller.js';
import { getTransactions, uploadTransactionProof } from '../controllers/paymentsController.js';
import { getInstaMediaByDealID, getEngagementAndBudgetByDealID } from '../controllers/campaignContent.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/addCampaign', upload.single('blogMainImg'), addCampaign);
router.post('/uploadTransactionProof', upload.single('screenshot'), uploadTransactionProof);
router.get('/getCampaigns', getCampaigns);
router.post('/getInfluencers', getInfluencers);
router.get('/search', searchInfluencers);
router.post('/addToNetwork', addToNetwork);
router.get('/getNetwork', getNetwork);
router.post('/addContract', addContract);
router.put('/removeFromNetwork', removeFromNetwork);
router.get('/getBrandContracts/:dealID', getBrandContracts);
router.delete('/contracts/withdraw', withdrawContract);
router.get('/getContractDetails/:contractID', getContractDetails);
router.put('/updateContract/:contractID', updateContractDetails);
router.put('/rejectProposal', rejectProposal);
router.put('/approveProposal',upload.single('screenshot'), approveProposal);
router.get('/proposalDetails', proposalDetails);
router.put('/cancelContractRequest/:contractID', cancelContractRequest);
router.get('/getReport/:userName', getReport);
router.get('/getPredicitedReport/:userName', getPredicitedReport);
router.get('/checkDealsWithContracts', checkDealsWithContracts);
router.get('/networkInfluencers', networkInfluencers);
router.post('/createQuery', createQuery);
router.post('/sendPosts', sendPosts);
router.put('/approveMedia/:postID', approveMedia);
router.put('/instructMedia/:postID', instructMedia);
router.get('/verifyLinks/:contractID', verifyLinks);
router.put('/approveContract/:contractID', approveContract);
router.get('/getTransactions/:dealID', getTransactions);
router.get('/getInstaMediaByDealID/:dealID', getInstaMediaByDealID);
router.get('/getEngagementAndBudgetByDealID/:dealID', getEngagementAndBudgetByDealID);

export default router;