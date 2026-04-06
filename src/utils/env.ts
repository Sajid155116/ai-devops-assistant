import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT ?? 8080);

if (!Number.isInteger(port) || port < 1) {
  throw new Error("Invalid PORT value. Use a positive integer.");
}

export const env = {
  port,
  nodeEnv: process.env.NODE_ENV ?? "development",
};
