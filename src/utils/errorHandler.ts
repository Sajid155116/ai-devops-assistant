import type { NextFunction, Request, Response } from "express";
import { LogAnalysisServiceError } from "../services/logAnalysisService.js";

export function jsonSyntaxErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      error: "Malformed JSON payload.",
    });
  }

  return next(err);
}

export function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof LogAnalysisServiceError) {
    console.error("LLM service error:", err.message);
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  console.error("Unexpected server error:", err);
  return res.status(500).json({
    error: "Internal server error.",
  });
}
