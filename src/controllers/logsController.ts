import type { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { getLogByIdService, getLogsService } from "../services/logService.js";

type LogsQuery = {
  projectId?: unknown;
};

export async function getLogsController(req: Request, res: Response, next: NextFunction) {
  const query = req.query as LogsQuery;

  if (
    query.projectId !== undefined &&
    (typeof query.projectId !== "string" || !isValidObjectId(query.projectId))
  ) {
    return res.status(400).json({
      error: "Invalid query. 'projectId' must be a valid id when provided.",
    });
  }

  try {
    const logs = await getLogsService(typeof query.projectId === "string" ? query.projectId : undefined);
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
