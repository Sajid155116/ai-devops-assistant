import { Schema, model } from "mongoose";

export type ProjectDocument = {
  name: string;
  repo: string;
  createdAt: Date;
};

const projectSchema = new Schema<ProjectDocument>(
  {
    name: { type: String, required: true, trim: true },
    repo: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  },
);

projectSchema.index({ createdAt: -1 });

export const Project = model<ProjectDocument>("Project", projectSchema);
