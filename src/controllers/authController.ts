import type { NextFunction, Request, Response } from "express";
import { loginService, registerService } from "../services/authService.js";

type RegisterBody = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
};

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

export async function registerController(req: Request, res: Response, next: NextFunction) {
  const body = req.body as RegisterBody | undefined;

  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const { name, email, password } = body;

  if (typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "'name' must be a non-empty string." });
  }

  if (typeof email !== "string" || email.trim().length === 0) {
    return res.status(400).json({ error: "'email' must be a non-empty string." });
  }

  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "'password' must be at least 6 characters." });
  }

  try {
    const result = await registerService({
      name,
      email,
      password,
    });

    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function loginController(req: Request, res: Response, next: NextFunction) {
  const body = req.body as LoginBody | undefined;

  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const { email, password } = body;

  if (typeof email !== "string" || email.trim().length === 0) {
    return res.status(400).json({ error: "'email' must be a non-empty string." });
  }

  if (typeof password !== "string" || password.length === 0) {
    return res.status(400).json({ error: "'password' must be a non-empty string." });
  }

  try {
    const result = await loginService({ email, password });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
