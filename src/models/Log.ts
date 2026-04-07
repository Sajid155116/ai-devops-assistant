import { Schema, Types, model } from "mongoose";

export type LogStatus = "failed" | "success";

export type LogDocument = {
  userId?: Types.ObjectId;
  projectId: Types.ObjectId;
  logs: string;
  summary: string;
  rootCause: string;
  fixSuggestion: string;
  status: LogStatus;
  createdAt: Date;
};

const logSchema = new Schema<LogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    logs: { type: String, default: "" },
    summary: { type: String, default: "" },
    rootCause: { type: String, default: "" },
    fixSuggestion: { type: String, default: "" },
    status: { type: String, enum: ["failed", "success"], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  },
);

logSchema.index({ projectId: 1 });
logSchema.index({ createdAt: -1 });
logSchema.index({ userId: 1, createdAt: -1 });

export const Log = model<LogDocument>("Log", logSchema);
