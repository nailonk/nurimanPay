import express from 'express';
import * as programController from '../controller/programController.js';
import { validate } from '../middleware/validate.js'; 
import { createProgramSchema } from '../validator/programValidator.js'; 
import { isAdminOnly } from '../middleware/authLogin.js'; 

const router = express.Router();

router.get('/', programController.getAllPrograms);
router.get('/:id', programController.getProgramTransactions);
router.get('/:id/transactions', programController.getProgramTransactions);

router.post('/create', isAdminOnly, validate(createProgramSchema),programController.createProgram);
router.put('/:id', isAdminOnly, validate(createProgramSchema), programController.updateProgram);

export default router;