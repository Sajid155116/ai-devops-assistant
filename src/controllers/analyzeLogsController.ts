import type { NextFunction, Request, Response } from "express";
import { analyzeLogsService } from "../services/logAnalysisService.js";

type AnalyzeLogsRequestBody = {
  logs?: unknown;
};

export async function analyzeLogsController(req: Request, res: Response, next: NextFunction) {
  const body = req.body as AnalyzeLogsRequestBody | undefined;

  if (!body || typeof body !== "object") {
    return res.status(400).json({
      error: "Invalid request body. Expected JSON object with 'logs' field.",
    });
  }

  const { logs } = body;

  if (typeof logs !== "string" || logs.trim().length === 0) {
    return res.status(400).json({
      error: "Invalid request body. 'logs' must be a non-empty string.",
    });
  }

  try {
    const result = await analyzeLogsService(logs);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
