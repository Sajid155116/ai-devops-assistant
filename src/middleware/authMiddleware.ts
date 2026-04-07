import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../utils/env.js";

type JwtPayload = {
  userId: string;
  email: string;
};

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Missing or invalid Authorization header.",
    });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    return res.status(401).json({
      error: "Missing token.",
    });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;

    if (!payload.userId || !payload.email) {
      return res.status(401).json({
        error: "Invalid token payload.",
      });
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    return next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired token.",
    });
  }
}
