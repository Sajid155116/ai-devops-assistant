export type LogAnalysisResult = {
  summary: string;
  rootCause: string;
  fixSuggestion: string;
};

const defaultAnalysisResult: LogAnalysisResult = {
  summary: "Unable to confidently parse model output.",
  rootCause: "LLM returned a response that was not valid structured JSON.",
  fixSuggestion:
    "Re-run analysis with a shorter log chunk or stricter model settings, then inspect raw model output.",
};

type LlmApiSuccess = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export class LogAnalysisServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "LogAnalysisServiceError";
    this.statusCode = statusCode;
  }
}

function buildPrompt(logs: string): string {
  return `You are a senior DevOps engineer.

Analyze the following CI/CD logs and provide:
1. Summary of failure
2. Root cause
3. Fix suggestion

IMPORTANT:
- Keep response concise
- Be accurate and technical

Logs:
${logs}

Return output strictly in JSON format:
{
  "summary": "...",
  "rootCause": "...",
  "fixSuggestion": "..."
}`;
}

function sanitizeText(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  return trimmed;
}

function isLogAnalysisResult(value: unknown): value is LogAnalysisResult {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as LogAnalysisResult).summary === "string" &&
    typeof (value as LogAnalysisResult).rootCause === "string" &&
    typeof (value as LogAnalysisResult).fixSuggestion === "string"
  );
}

function tryParseJson(candidate: string): unknown | undefined {
  try {
    return JSON.parse(candidate);
  } catch {
    return undefined;
  }
}

function extractJsonSafely(text: string): LogAnalysisResult {
  const sanitized = sanitizeText(text);

  const directParsed = tryParseJson(sanitized);
  if (isLogAnalysisResult(directParsed)) {
    return directParsed;
  }

  const start = sanitized.indexOf("{");
  const end = sanitized.lastIndexOf("}");

  if (start !== -1 && end !== -1 && end > start) {
    const slicedParsed = tryParseJson(sanitized.slice(start, end + 1));
    if (isLogAnalysisResult(slicedParsed)) {
      return slicedParsed;
    }
  }

  return defaultAnalysisResult;
}

export async function analyzeLogsService(logs: string): Promise<LogAnalysisResult> {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    throw new LogAnalysisServiceError("LLM_API_KEY is not configured.", 500);
  }

  const apiUrl = process.env.LLM_API_URL ?? "https://openrouter.ai/api/v1/chat/completions";
  const model = process.env.LLM_MODEL ?? "openai/gpt-4o-mini";

  let response: Response;

  try {
    response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: buildPrompt(logs),
          },
        ],
        temperature: 0.2,
      }),
    });
  } catch {
    throw new LogAnalysisServiceError("Unable to reach LLM API.", 502);
  }

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new LogAnalysisServiceError(
      `LLM API error (${response.status})${details ? `: ${details}` : ""}`,
      502,
    );
  }

  let payload: LlmApiSuccess;
  try {
    payload = (await response.json()) as LlmApiSuccess;
  } catch {
    throw new LogAnalysisServiceError("LLM API returned unreadable JSON payload.", 502);
  }

  const content = payload.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new LogAnalysisServiceError("LLM API response did not include content.", 502);
  }

  return extractJsonSafely(content);
}
