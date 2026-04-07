import { Router } from "express";
import { loginController, registerController } from "../controllers/authController.js";

export const authRoutes = Router();

authRoutes.post("/auth/register", registerController);
authRoutes.post("/auth/login", loginController);
