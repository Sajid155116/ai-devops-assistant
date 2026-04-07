import { Router } from "express";
import { getProjectsController } from "../controllers/projectsController.js";

export const projectsRoutes = Router();

projectsRoutes.get("/projects", getProjectsController);
