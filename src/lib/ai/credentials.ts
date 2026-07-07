import {
  getModelDefinition,
  getProviderDefaultBaseUrl,
  type ModelId,
} from "@/config/models";
import type { ProviderCredentials } from "./types";

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

function resolveEnvValue(names: string[]): string | undefined {
  for (const name of names) {
    const value = readEnv(name);
    if (value) {
      return value;
    }
  }
  return undefined;
}

export function getModelCredentials(modelId: ModelId): ProviderCredentials {
  const model = getModelDefinition(modelId);

  return {
    baseUrl:
      resolveEnvValue(model.baseUrlEnvVars) ??
      getProviderDefaultBaseUrl(model.provider),
    apiKey: resolveEnvValue(model.apiKeyEnvVars),
  };
}

export function assertModelCredentials(
  modelId: ModelId,
  credentials: ProviderCredentials,
): asserts credentials is Required<ProviderCredentials> {
  const model = getModelDefinition(modelId);

  if (!credentials.baseUrl && model.provider === "openai-compatible") {
    throw new Error(`Missing base URL for model ${modelId}`);
  }

  if (!credentials.apiKey) {
    throw new Error(`Missing API key for model ${modelId}`);
  }
}
