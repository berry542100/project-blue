import {
  getModelDefinition,
  getProviderDefaultBaseUrl,
  type ModelId,
} from "@/config/models";
import { AIConfigurationError } from "./errors";
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
    throw new AIConfigurationError(
      `Missing base URL for model ${modelId}. Set one of: ${model.baseUrlEnvVars.join(", ")}`,
    );
  }

  if (!credentials.apiKey) {
    throw new AIConfigurationError(
      `Missing API key for model ${modelId}. Set one of: ${model.apiKeyEnvVars.join(", ")}`,
    );
  }
}
