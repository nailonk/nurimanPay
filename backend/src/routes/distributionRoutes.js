import express from 'express';
import * as distributionController from '../controller/distributionController.js';
import { isAdminOnly } from '../middleware/authLogin.js';

const router = express.Router();

router.get('/', distributionController.getAllDistributions);
router.get('/program/:programId', distributionController.getDistributionsByProgram);
router.get('/summary/:programId', distributionController.getProgramSummary);
router.get('/:id', distributionController.getDistributionById);

router.post('/create', isAdminOnly, distributionController.createDistribution);
router.put('/:id', isAdminOnly, distributionController.updateDistribution);
router.delete('/:id', isAdminOnly, distributionController.deleteDistribution);

export default router;
