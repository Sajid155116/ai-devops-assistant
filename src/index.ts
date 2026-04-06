import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./utils/env.js";
import { analyzeLogsRoutes } from "./routes/analyzeLogsRoutes.js";
import { healthRoutes } from "./routes/healthRoutes.js";
import { globalErrorHandler, jsonSyntaxErrorHandler } from "./utils/errorHandler.js";
import { requestLogger } from "./utils/requestLogger.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(requestLogger);
app.use(express.json());
app.use(jsonSyntaxErrorHandler);

app.use(healthRoutes);
app.use(analyzeLogsRoutes);
app.use(globalErrorHandler);

app.listen(env.port, "0.0.0.0", () => {
  console.log(`ai-devops-assistant started`);
  console.log(`environment: ${env.nodeEnv}`);
  console.log(`listening on 0.0.0.0:${env.port}`);
});
