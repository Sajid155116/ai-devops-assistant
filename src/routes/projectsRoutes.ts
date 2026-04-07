import { Router } from "express";
import { createProjectController, getProjectsController } from "../controllers/projectsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const projectsRoutes = Router();

projectsRoutes.get("/projects", authMiddleware, getProjectsController);
projectsRoutes.post("/projects", authMiddleware, createProjectController);
