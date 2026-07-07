export type ParsedDecisionResult = {
  summary: string;
  options: string[];
  risks: string[];
  recommendation: string;
  confidence: number;
};

export function extractJsonPayload(raw: string): string {
  let cleaned = raw.trim();

  cleaned = cleaned.replace(/[\s\S]*?<\/think>/gi, "").trim();

  const fenced = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    cleaned = fenced[1].trim();
  }

  const objectMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    cleaned = objectMatch[0];
  }

  return cleaned;
}

export function parseAIDecisionResult(
  raw: string | ParsedDecisionResult,
): ParsedDecisionResult {
  if (typeof raw !== "string") {
    return normalizeResult(raw);
  }

  const payload = extractJsonPayload(raw);
  return normalizeResult(JSON.parse(payload) as Partial<ParsedDecisionResult>);
}

function normalizeResult(
  parsed: Partial<ParsedDecisionResult>,
): ParsedDecisionResult {
  return {
    summary: parsed.summary ?? "",
    options: Array.isArray(parsed.options) ? parsed.options : [],
    risks: Array.isArray(parsed.risks) ? parsed.risks : [],
    recommendation: parsed.recommendation ?? "",
    confidence:
      typeof parsed.confidence === "number" ? parsed.confidence : 0,
  };
}
