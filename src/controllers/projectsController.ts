import type { NextFunction, Request, Response } from "express";
import { getProjectsService } from "../services/projectService.js";

export async function getProjectsController(_req: Request, res: Response, next: NextFunction) {
  try {
    const projects = await getProjectsService();
    return res.status(200).json(projects);
  } catch (error) {
    return next(error);
  }
}
