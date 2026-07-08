export const MODEL_COOKIE_NAME = "PB_MODEL";

export const SHARED_BASE_URL_ENV_VARS = ["AI_BASE_URL"] as const;
export const SHARED_API_KEY_ENV_VARS = ["AI_API_KEY"] as const;

export const MODEL_IDS = ["qwen", "deepseek-v3", "deepseek-r1"] as const;

export type ModelId = (typeof MODEL_IDS)[number];

export type ModelDefinition = {
  id: ModelId;
  labelKey: string;
  apiModelEnvVar: string;
  defaultApiModelId: string;
};

export const MODELS: ModelDefinition[] = [
  {
    id: "qwen",
    labelKey: "qwen",
    apiModelEnvVar: "PB_MODEL_QWEN",
    defaultApiModelId: "Qwen/Qwen3-32B",
  },
  {
    id: "deepseek-v3",
    labelKey: "deepseekV3",
    apiModelEnvVar: "PB_MODEL_DEEPSEEK_V3",
    defaultApiModelId: "deepseek-ai/DeepSeek-V3",
  },
  {
    id: "deepseek-r1",
    labelKey: "deepseekR1",
    apiModelEnvVar: "PB_MODEL_DEEPSEEK_R1",
    defaultApiModelId: "deepseek-ai/DeepSeek-R1",
  },
];

export const DEFAULT_MODEL_ID: ModelId = "qwen";

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : undefined;
}

function resolveEnvValue(names: readonly string[]): string | undefined {
  for (const name of names) {
    const value = readEnv(name);
    if (value) {
      return value;
    }
  }
  return undefined;
}

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

export function getSharedBaseUrl(): string | undefined {
  return resolveEnvValue(SHARED_BASE_URL_ENV_VARS);
}

export function getSharedApiKey(): string | undefined {
  return resolveEnvValue(SHARED_API_KEY_ENV_VARS);
}

export function getApiModelId(modelId: ModelId): string {
  const model = getModelDefinition(modelId);
  const configured = readEnv(model.apiModelEnvVar);

  if (configured) {
    return configured;
  }

  if (modelId === DEFAULT_MODEL_ID) {
    const fallback = readEnv("AI_MODEL");
    if (fallback) {
      return fallback;
    }
  }

  return model.defaultApiModelId;
}

export type ModelConfigStatus = {
  id: ModelId;
  labelKey: string;
  apiModelId: string;
};

export type AIConfigStatus = {
  configured: boolean;
  defaultModelId: ModelId;
  baseUrl: string | null;
  hasApiKey: boolean;
  models: ModelConfigStatus[];
  warnings: string[];
};

export function getAIConfigStatus(): AIConfigStatus {
  const baseUrl = getSharedBaseUrl();
  const apiKey = getSharedApiKey();
  const warnings: string[] = [];

  if (baseUrl?.startsWith("sk-")) {
    warnings.push(
      "AI_BASE_URL looks like an API key — use https://api.siliconflow.cn/v1",
    );
  }

  if (apiKey?.startsWith("http://") || apiKey?.startsWith("https://")) {
    warnings.push("AI_API_KEY looks like a URL — use your sk-... key instead");
  }

  return {
    configured: Boolean(baseUrl && apiKey),
    defaultModelId: DEFAULT_MODEL_ID,
    baseUrl: baseUrl ?? null,
    hasApiKey: Boolean(apiKey),
    models: MODELS.map((model) => ({
      id: model.id,
      labelKey: model.labelKey,
      apiModelId: getApiModelId(model.id),
    })),
    warnings,
  };
}
