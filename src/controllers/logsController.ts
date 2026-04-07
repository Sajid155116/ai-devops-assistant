import type { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { getLogByIdService, getLogsService } from "../services/logService.js";

type LogsQuery = {
  projectName?: unknown;
};

export async function getLogsController(req: Request, res: Response, next: NextFunction) {
  const query = req.query as LogsQuery;

  if (
    query.projectName !== undefined &&
    (typeof query.projectName !== "string" || query.projectName.trim().length === 0)
  ) {
    return res.status(400).json({
      error: "Invalid query. 'projectName' must be a non-empty string when provided.",
    });
  }

  try {
    const logs = await getLogsService(
      typeof query.projectName === "string" ? query.projectName.trim() : undefined,
    );
    return res.status(200).json(logs);
  } catch (error) {
    return next(error);
  }
}

export async function getLogByIdController(req: Request, res: Response, next: NextFunction) {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (typeof id !== "string" || !isValidObjectId(id)) {
    return res.status(400).json({
      error: "Invalid log id.",
    });
  }

  try {
    const log = await getLogByIdService(id);

    if (!log) {
      return res.status(404).json({
        error: "Log not found.",
      });
    }

    return res.status(200).json(log);
  } catch (error) {
    return next(error);
  }
}
