import express from "express";
import { login } from "../controller/authController.js";
import { validate } from "../middleware/validate.js"; 
import { loginSchema } from "../validator/authValidator.js"; 

const router = express.Router();

// Route untuk Login (Tidak pakai isAdminOnly karena belum punya token)
router.post('/login', validate(loginSchema), login);

export default router;