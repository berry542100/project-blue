export class AIConfigurationError extends Error {
  readonly code = "AI_CONFIGURATION_ERROR";

  constructor(message: string) {
    super(message);
    this.name = "AIConfigurationError";
  }
}

export class AIUpstreamError extends Error {
  readonly code = "AI_UPSTREAM_ERROR";

  constructor(
    message: string,
    readonly provider: string,
    readonly status: number,
    readonly responseBody: string,
  ) {
    super(message);
    this.name = "AIUpstreamError";
  }
}

export async function readResponseErrorBody(response: Response): Promise<string> {
  try {
    const text = await response.text();
    return text.slice(0, 1000);
  } catch {
    return "";
  }
}

export function logAIError(
  context: string,
  error: unknown,
  extra?: Record<string, unknown>,
): void {
  const payload: Record<string, unknown> = {
    context,
    ...extra,
  };

  if (error instanceof AIConfigurationError) {
    payload.errorType = "configuration";
    payload.message = error.message;
  } else if (error instanceof AIUpstreamError) {
    payload.errorType = "upstream";
    payload.message = error.message;
    payload.provider = error.provider;
    payload.status = error.status;
    payload.responseBody = error.responseBody;
  } else if (error instanceof SyntaxError) {
    payload.errorType = "parse";
    payload.message = error.message;
  } else if (error instanceof Error) {
    payload.errorType = "unknown";
    payload.message = error.message;
    payload.name = error.name;
  } else {
    payload.errorType = "unknown";
    payload.message = String(error);
  }

  console.error("[ProjectBlue AI]", JSON.stringify(payload));
}
