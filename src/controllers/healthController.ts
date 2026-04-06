import type { Request, Response } from "express";
import { healthService } from "../services/healthService.js";

export function getHealth(_req: Request, res: Response) {
  res.status(200).json(healthService());
}
