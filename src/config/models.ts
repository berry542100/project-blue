import { AIConfigurationError } from "@/lib/ai/errors";

export const MODEL_ID = "qwen" as const;
export type ModelId = typeof MODEL_ID;

const BASE_URL_ENV_VARS = ["PB_BASE_URL_QWEN", "AI_BASE_URL"] as const;
const API_KEY_ENV_VARS = ["PB_API_KEY_QWEN", "AI_API_KEY"] as const;
const API_MODEL_ENV_VARS = ["PB_MODEL_QWEN", "AI_MODEL"] as const;

function readEnv(names: readonly string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value && value.length > 0) {
      return value;
    }
  }
  return undefined;
}

export type AIConfigStatus = {
  configured: boolean;
  vars: {
    AI_BASE_URL: boolean;
    AI_API_KEY: boolean;
    AI_MODEL: boolean;
  };
  warnings: string[];
};

export function getAIConfigStatus(): AIConfigStatus {
  const baseUrl = getModelBaseUrl();
  const apiKey = getModelApiKey();
  const model = readEnv(API_MODEL_ENV_VARS);
  const warnings: string[] = [];

  if (baseUrl?.startsWith("sk-")) {
    warnings.push("AI_BASE_URL looks like an API key — use https://api.siliconflow.cn/v1");
  }

  if (apiKey?.startsWith("http://") || apiKey?.startsWith("https://")) {
    warnings.push("AI_API_KEY looks like a URL — use your sk-... key instead");
  }

  return {
    configured: Boolean(baseUrl && apiKey && model),
    vars: {
      AI_BASE_URL: Boolean(process.env.AI_BASE_URL?.trim()),
      AI_API_KEY: Boolean(process.env.AI_API_KEY?.trim()),
      AI_MODEL: Boolean(process.env.AI_MODEL?.trim()),
    },
    warnings,
  };
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
