import express from "express";
import {login} from "../controller/authController.js";
const router = express.Router();

// Register route
router.post('/login', login);
export default router;