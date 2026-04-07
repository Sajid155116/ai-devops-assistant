import { Router } from "express";
import { getLogByIdController, getLogsController } from "../controllers/logsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const logsRoutes = Router();

logsRoutes.get("/logs", authMiddleware, getLogsController);
logsRoutes.get("/logs/:id", authMiddleware, getLogByIdController);
