import { Schema, Types, model } from "mongoose";

export type ProjectDocument = {
  userId?: Types.ObjectId;
  name: string;
  repo: string;
  createdAt: Date;
};

const projectSchema = new Schema<ProjectDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    repo: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  },
);

projectSchema.index({ createdAt: -1 });
projectSchema.index({ userId: 1, createdAt: -1 });

export const Project = model<ProjectDocument>("Project", projectSchema);
