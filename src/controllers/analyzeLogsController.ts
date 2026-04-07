import type { NextFunction, Request, Response } from "express";
import { analyzeLogsService } from "../services/logAnalysisService.js";
import { persistLogService } from "../services/logService.js";
import { findOrCreateProjectByNameService } from "../services/projectService.js";

type AnalyzeLogsRequestBody = {
  logs?: unknown;
  projectName?: unknown;
  status?: unknown;
};

export async function analyzeLogsController(req: Request, res: Response, next: NextFunction) {
  const body = req.body as AnalyzeLogsRequestBody | undefined;

  if (!body || typeof body !== "object") {
    return res.status(400).json({
      error: "Invalid request body. Expected JSON object with 'projectName', 'logs', and 'status' fields.",
    });
  }

  const { logs, projectName, status } = body;

  if (typeof logs !== "string" || logs.trim().length === 0) {
    return res.status(400).json({
      error: "Invalid request body. 'logs' must be a non-empty string.",
    });
  }

  if (typeof projectName !== "string" || projectName.trim().length === 0) {
    return res.status(400).json({
      error: "Invalid request body. 'projectName' must be a non-empty string.",
    });
  }

  if (status !== "failed" && status !== "success") {
    return res.status(400).json({
      error: "Invalid request body. 'status' must be either 'failed' or 'success'.",
    });
  }

  try {
    const project = await findOrCreateProjectByNameService(projectName.trim());

    try {
      if (status === "success") {
        await persistLogService({
          projectId: project.id,
          logs,
          status,
        });

        return res.status(200).json({
          message: "Success logs stored.",
        });
      }

      const result = await analyzeLogsService(logs);

      await persistLogService({
        projectId: project.id,
        logs,
        summary: result.summary,
        rootCause: result.rootCause,
        fixSuggestion: result.fixSuggestion,
        status,
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error("Database persistence error:", error);
      return next(new Error("Failed to persist analysis result."));
    }
  } catch (error) {
    return next(error);
  }
}
