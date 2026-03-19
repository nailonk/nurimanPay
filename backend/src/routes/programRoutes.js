import express from 'express';
import { getAllPrograms, createProgram } from '../controller/programController.js';

const router = express.Router();

// Jalur: GET /api/program
router.get('/', getAllPrograms);
router.post('/create', createProgram);

export default router;