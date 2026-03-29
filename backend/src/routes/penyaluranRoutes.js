import express from 'express';
import * as penyaluranController from '../controllers/penyaluranController.js';

const router = express.Router();

// ========== PUBLIC ROUTES ==========
router.get('/', penyaluranController.getAllDistributions);
router.get('/program/:programId', penyaluranController.getDistributionsByProgram);
router.get('/summary/:programId', penyaluranController.getProgramSummary);
router.get('/:id', penyaluranController.getDistributionById);

// ========== ADMIN ROUTES ==========
router.post('/', penyaluranController.createDistribution);
router.put('/:id', penyaluranController.updateDistribution);
router.delete('/:id', penyaluranController.deleteDistribution);

export default router;
