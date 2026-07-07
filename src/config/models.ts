import { AIConfigurationError } from "@/lib/ai/errors";

export const MODEL_ID = "qwen" as const;
export type ModelId = typeof MODEL_ID;

const BASE_URL_ENV_VARS = ["PB_BASE_URL_QWEN", "AI_BASE_URL"] as const;
const API_KEY_ENV_VARS = ["PB_API_KEY_QWEN", "AI_API_KEY"] as const;
const API_MODEL_ENV_VARS = ["PB_MODEL_QWEN", "AI_MODEL"] as const;

function readEnv(names: readonly string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.length > 0) {
      return value;
    }
  }
  return undefined;
}

export function getApiModelId(): string {
  const configured = readEnv(API_MODEL_ENV_VARS);
  if (configured) {
    return configured;
  }

  throw new AIConfigurationError(
    "API model not configured. Set PB_MODEL_QWEN or AI_MODEL",
  );
}

export function getModelBaseUrl(): string | undefined {
  return readEnv(BASE_URL_ENV_VARS);
}

export function getModelApiKey(): string | undefined {
  return readEnv(API_KEY_ENV_VARS);
}

export function getBaseUrlEnvVarNames(): string {
  return BASE_URL_ENV_VARS.join(", ");
}

export function getApiKeyEnvVarNames(): string {
  return API_KEY_ENV_VARS.join(", ");
}
