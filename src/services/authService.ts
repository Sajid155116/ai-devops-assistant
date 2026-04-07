import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../utils/env.js";

const TOKEN_EXPIRY = "7d";
const SALT_ROUNDS = 10;

type AuthTokenPayload = {
  userId: string;
  email: string;
};

function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: TOKEN_EXPIRY });
}

export class AuthServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AuthServiceError";
    this.statusCode = statusCode;
  }
}

export async function registerService(input: {
  name: string;
  email: string;
  password: string;
}): Promise<{ token: string }> {
  const normalizedEmail = input.email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail }).select("_id").lean();
  if (existingUser) {
    throw new AuthServiceError("Email is already registered.", 409);
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await User.create({
    name: input.name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  return {
    token: signToken({ userId: String(user._id), email: user.email }),
  };
}

export async function loginService(input: {
  email: string;
  password: string;
}): Promise<{ token: string }> {
  const normalizedEmail = input.email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new AuthServiceError("Invalid email or password.", 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password);
  if (!passwordMatches) {
    throw new AuthServiceError("Invalid email or password.", 401);
  }

  return {
    token: signToken({ userId: String(user._id), email: user.email }),
  };
}
