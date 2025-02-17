import express from 'express';
import { addReport, updateReport, getReports } from '../controllers/reportController.js';

const router = express.Router();
router.post('/addReport', addReport);
router.put('/modifyReport/:id', updateReport);
router.get('/getReports', getReports);

export default router;