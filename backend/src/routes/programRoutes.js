import express from 'express';
import { updateProgram, getProgramTransactions, getAllPrograms, createProgram } from '../controller/programController.js';
import { validate } from '../middleware/validate.js'; 
import { createProgramSchema } from '../validator/programValidator.js'; 
import { isAdminOnly } from '../middleware/authLogin.js'; // <--- Import ini

const router = express.Router();

// Siapa pun boleh lihat daftar program (Public)
router.get('/', getAllPrograms);
router.get('/:id', getProgramTransactions);

// HANYA ADMIN yang bisa buat program
router.post('/create', isAdminOnly, validate(createProgramSchema),createProgram);
router.put('/:id', isAdminOnly, validate(createProgramSchema), updateProgram);
export default router;