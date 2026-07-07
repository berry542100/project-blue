export const MODEL_COOKIE_NAME = "PB_MODEL";

export const PROVIDER_IDS = [
  "openai-compatible",
  "anthropic",
  "google",
] as const;

export type ProviderId = (typeof PROVIDER_IDS)[number];

export const MODEL_IDS = [
  "deepseek-v3",
  "gpt-5",
  "claude-sonnet",
  "gemini",
  "qwen",
] as const;

export type ModelId = (typeof MODEL_IDS)[number];

export type ModelDefinition = {
  id: ModelId;
  labelKey: string;
  provider: ProviderId;
  apiModelEnvVar: string;
  baseUrlEnvVars: string[];
  apiKeyEnvVars: string[];
};

export const MODELS: ModelDefinition[] = [
  {
    id: "deepseek-v3",
    labelKey: "deepseekV3",
    provider: "openai-compatible",
    apiModelEnvVar: "PB_MODEL_DEEPSEEK_V3",
    baseUrlEnvVars: ["PB_BASE_URL_DEEPSEEK_V3", "AI_BASE_URL"],
    apiKeyEnvVars: ["PB_API_KEY_DEEPSEEK_V3", "AI_API_KEY"],
  },
  {
    id: "gpt-5",
    labelKey: "gpt5",
    provider: "openai-compatible",
    apiModelEnvVar: "PB_MODEL_GPT_5",
    baseUrlEnvVars: ["PB_BASE_URL_GPT_5", "AI_BASE_URL_OPENAI", "AI_BASE_URL"],
    apiKeyEnvVars: ["PB_API_KEY_GPT_5", "AI_API_KEY_OPENAI", "AI_API_KEY"],
  },
  {
    id: "claude-sonnet",
    labelKey: "claudeSonnet",
    provider: "anthropic",
    apiModelEnvVar: "PB_MODEL_CLAUDE_SONNET",
    baseUrlEnvVars: ["PB_BASE_URL_CLAUDE_SONNET", "AI_BASE_URL_ANTHROPIC"],
    apiKeyEnvVars: [
      "PB_API_KEY_CLAUDE_SONNET",
      "AI_API_KEY_ANTHROPIC",
      "ANTHROPIC_API_KEY",
    ],
  },
  {
    id: "gemini",
    labelKey: "gemini",
    provider: "google",
    apiModelEnvVar: "PB_MODEL_GEMINI",
    baseUrlEnvVars: ["PB_BASE_URL_GEMINI", "AI_BASE_URL_GOOGLE"],
    apiKeyEnvVars: [
      "PB_API_KEY_GEMINI",
      "AI_API_KEY_GOOGLE",
      "GOOGLE_API_KEY",
      "GEMINI_API_KEY",
    ],
  },
  {
    id: "qwen",
    labelKey: "qwen",
    provider: "openai-compatible",
    apiModelEnvVar: "PB_MODEL_QWEN",
    baseUrlEnvVars: ["PB_BASE_URL_QWEN", "AI_BASE_URL"],
    apiKeyEnvVars: ["PB_API_KEY_QWEN", "AI_API_KEY"],
  },
];

export const DEFAULT_MODEL_ID: ModelId = "qwen";

const PROVIDER_DEFAULT_BASE_URL: Partial<Record<ProviderId, string>> = {
  anthropic: "https://api.anthropic.com/v1",
  google: "https://generativelanguage.googleapis.com/v1beta",
};

export function isModelId(value: string): value is ModelId {
  return MODEL_IDS.includes(value as ModelId);
}

export function resolveModelId(value: string | null | undefined): ModelId {
  if (value && isModelId(value)) {
    return value;
  }
  return DEFAULT_MODEL_ID;
}

export function getModelDefinition(modelId: ModelId): ModelDefinition {
  const model = MODELS.find((entry) => entry.id === modelId);
  if (!model) {
    throw new Error(`Unknown model id: ${modelId}`);
  }
  return model;
}

export function getProviderDefaultBaseUrl(
  providerId: ProviderId,
): string | undefined {
  return PROVIDER_DEFAULT_BASE_URL[providerId];
}

export function getApiModelId(modelId: ModelId): string {
  const model = getModelDefinition(modelId);
  const configured = process.env[model.apiModelEnvVar];

  if (configured) {
    return configured;
  }

  if (modelId === DEFAULT_MODEL_ID && process.env.AI_MODEL) {
    return process.env.AI_MODEL;
  }

  throw new Error(`API model not configured for ${modelId}`);
}
