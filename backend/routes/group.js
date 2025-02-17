import express from 'express';
import {
  createGroup,
  addGroupMember,
  getGroupMessages,
  sendGroupMessage,
  getGroupMessagesByGroupId,
  getGroups,
  getAllGroups,
  modifyGroup,getGroupById,
  deleteGroup
} from '../controllers/groupController.js';
import { toggleFollowGroup, checkFollowStatus, unfollowGroup } from '../controllers/FollowGroup.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


// Define the route to fetch a group by ID
router.get('/group/:id', getGroupById);
router.post('/follow', toggleFollowGroup);
// Check Follow Status for a Group
router.get('/follow', checkFollowStatus);
// Unfollow a group
router.post('/unfollow', unfollowGroup);




router.put('/group/modify/:groupId', upload.single('photo'), modifyGroup);
router.get('/all', getAllGroups);   // Fetch all groups 
router.delete('/group/delete/:groupId', deleteGroup);
router.get('/:groupId/messages', getGroupMessagesByGroupId);


router.post('/create', upload.single('photo'), createGroup); 
router.post('/addMember', addGroupMember); 
router.get('/:groupId/messages', getGroupMessages); 
router.post('/:groupId/sendMessage', sendGroupMessage); 
router.get('/:admin', getGroups); 

export default router;
