import { Project } from "../models/Project.js";

export type ProjectResponse = {
  id: string;
  name: string;
  repo: string;
  createdAt: Date;
};

export async function getProjectsService(): Promise<ProjectResponse[]> {
  const projects = await Project.find().sort({ createdAt: -1 }).lean();

  return projects.map((project) => ({
    id: String(project._id),
    name: project.name,
    repo: project.repo,
    createdAt: project.createdAt,
  }));
}

export async function findProjectByNameService(projectName: string): Promise<{ id: unknown } | null> {
  const project = (await Project.findOne({ name: projectName.trim() }).select("_id").lean()) as
    | { _id: unknown }
    | null;

  if (!project) {
    return null;
  }

  return { id: project._id };
}

export async function findOrCreateProjectByNameService(projectName: string): Promise<{ id: unknown }> {
  const normalizedProjectName = projectName.trim();

  const project = (await Project.findOneAndUpdate(
    { name: normalizedProjectName },
    {
      $setOnInsert: {
        name: normalizedProjectName,
        repo: normalizedProjectName,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    },
  )
    .select("_id")
    .lean()) as { _id: unknown } | null;

  if (!project) {
    throw new Error("Failed to find or create project.");
  }

  return { id: project._id };
}
