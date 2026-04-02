import express from "express";
import { login } from "../controller/authController.js";
import { validate } from "../middleware/validate.js"; 
import { loginSchema } from "../validator/authValidator.js"; 

const router = express.Router();

router.post('/login', validate(loginSchema), login);

export default router;