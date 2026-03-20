import express from "express";
import { login } from "../controller/authController.js";
import { validate } from "../middleware/validate.js"; // Import middleware
import { loginSchema } from "../validator/authValidator.js"; // Import skema

const router = express.Router();

// Alur: Route -> Middleware Joi -> Controller
router.post('/login', validate(loginSchema), login);

export default router;