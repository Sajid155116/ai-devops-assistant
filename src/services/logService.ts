import { Log } from "../models/Log.js";

type PersistLogInput = {
  projectId: unknown;
  logs: string;
  summary?: string;
  rootCause?: string;
  fixSuggestion?: string;
  status: "failed" | "success";
};

type PopulatedProject = {
  _id: unknown;
  name: string;
  repo: string;
};

type PopulatedLog = {
  _id: unknown;
  projectId: PopulatedProject;
  logs: string;
  summary: string;
  rootCause: string;
  fixSuggestion: string;
  status: string;
  createdAt: Date;
};

export type LogResponse = {
  id: string;
  project: {
    id: string;
    name: string;
    repo: string;
  };
  logs: string;
  summary: string;
  rootCause: string;
  fixSuggestion: string;
  status: string;
  createdAt: Date;
};

function toLogResponse(log: PopulatedLog): LogResponse {
  return {
    id: String(log._id),
    project: {
      id: String(log.projectId._id),
      name: log.projectId.name,
      repo: log.projectId.repo,
    },
    logs: log.logs,
    summary: log.summary,
    rootCause: log.rootCause,
    fixSuggestion: log.fixSuggestion,
    status: log.status,
    createdAt: log.createdAt,
  };
}

export async function persistLogService(input: PersistLogInput): Promise<void> {
  const payload: {
    projectId: unknown;
    logs: string;
    status: "failed" | "success";
    summary?: string;
    rootCause?: string;
    fixSuggestion?: string;
  } = {
    projectId: input.projectId,
    logs: input.logs,
    status: input.status,
  };

  if (typeof input.summary === "string") {
    payload.summary = input.summary;
  }

  if (typeof input.rootCause === "string") {
    payload.rootCause = input.rootCause;
  }

  if (typeof input.fixSuggestion === "string") {
    payload.fixSuggestion = input.fixSuggestion;
  }

  await Log.create(payload);
}

export async function getLogsService(requestedProjectId?: string): Promise<LogResponse[]> {
  const filter: { projectId?: unknown } = {};

  if (requestedProjectId) {
    filter.projectId = requestedProjectId;
  }

  const logs = ((await Log.find(filter)
    .sort({ createdAt: -1 })
    .populate("projectId", "name repo")
    .lean()) as unknown) as PopulatedLog[];

  return logs.map(toLogResponse);
}

export async function getLogByIdService(id: string): Promise<LogResponse | null> {
  const log = (await Log.findById(id).populate("projectId", "name repo").lean()) as
    | PopulatedLog
    | null;

  if (!log) {
    return null;
  }

  return toLogResponse(log);
}
