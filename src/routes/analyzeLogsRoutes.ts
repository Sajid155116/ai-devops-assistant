import { Router } from "express";
import { analyzeLogsController } from "../controllers/analyzeLogsController.js";

export const analyzeLogsRoutes = Router();

analyzeLogsRoutes.post("/analyze-logs", analyzeLogsController);
