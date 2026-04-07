import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT ?? 8080);
const mongoUri = process.env.MONGO_URI;

if (!Number.isInteger(port) || port < 1) {
  throw new Error("Invalid PORT value. Use a positive integer.");
}

if (!mongoUri) {
  throw new Error("Missing MONGO_URI environment variable.");
}

export const env = {
  port,
  nodeEnv: process.env.NODE_ENV ?? "development",
  mongoUri,
};
