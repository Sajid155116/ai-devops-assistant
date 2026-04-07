import { Router } from "express";
import { getLogByIdController, getLogsController } from "../controllers/logsController.js";

export const logsRoutes = Router();

logsRoutes.get("/logs", getLogsController);
logsRoutes.get("/logs/:id", getLogByIdController);
