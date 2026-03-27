import express from 'express';
import { getProgramTransactions, getAllPrograms, createProgram } from '../controller/programController.js';
import { validate } from '../middleware/validate.js'; // Pakai middleware universal
import { createProgramSchema } from '../validator/programValidator.js'; // Import schema program

const router = express.Router();

router.get('/', getAllPrograms);
router.get('/:id', getProgramTransactions);

// Pasang Satpam Joi di sini
router.post('/create', validate(createProgramSchema), createProgram);

export default router;