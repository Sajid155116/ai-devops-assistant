import type { NextFunction, Request, Response } from "express";
import { createProjectService, getProjectsService } from "../services/projectService.js";

type CreateProjectBody = {
  name?: unknown;
  repo?: unknown;
};

export async function getProjectsController(req: Request, res: Response, next: NextFunction) {
  try {
    const projects = await getProjectsService();
    return res.status(200).json(projects);
  } catch (error) {
    return next(error);
  }
}

export async function createProjectController(req: Request, res: Response, next: NextFunction) {
  const body = req.body as CreateProjectBody | undefined;

  if (!body || typeof body !== "object") {
    return res.status(400).json({
      error: "Invalid request body.",
    });
  }

  const { name, repo } = body;

  if (typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      error: "'name' must be a non-empty string.",
    });
  }

  if (typeof repo !== "string" || repo.trim().length === 0) {
    return res.status(400).json({
      error: "'repo' must be a non-empty string.",
    });
  }

  try {
    const project = await createProjectService({
      name,
      repo,
    });

    return res.status(201).json(project);
  } catch (error) {
    return next(error);
  }
}
