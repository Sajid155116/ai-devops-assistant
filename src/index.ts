import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./utils/env.js";
import { analyzeLogsRoutes } from "./routes/analyzeLogsRoutes.js";
import { healthRoutes } from "./routes/healthRoutes.js";
import { projectsRoutes } from "./routes/projectsRoutes.js";
import { logsRoutes } from "./routes/logsRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { globalErrorHandler, jsonSyntaxErrorHandler } from "./utils/errorHandler.js";
import { requestLogger } from "./utils/requestLogger.js";
import { connectToDatabase } from "./config/db.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(requestLogger);
app.use(express.json());
app.use(jsonSyntaxErrorHandler);

app.use(healthRoutes);
app.use(authRoutes);
app.use(analyzeLogsRoutes);
app.use(projectsRoutes);
app.use(logsRoutes);
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(env.port, "0.0.0.0", () => {
      console.log(`ai-devops-assistant started`);
      console.log(`environment: ${env.nodeEnv}`);
      console.log(`listening on 0.0.0.0:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

void startServer();
