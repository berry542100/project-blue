import {
  getApiKeyEnvVarNames,
  getBaseUrlEnvVarNames,
  getModelApiKey,
  getModelBaseUrl,
} from "@/config/models";
import { AIConfigurationError } from "./errors";
import type { ProviderCredentials } from "./types";

export function getModelCredentials(): ProviderCredentials {
  return {
    baseUrl: getModelBaseUrl(),
    apiKey: getModelApiKey(),
  };
}

export function assertModelCredentials(
  credentials: ProviderCredentials,
): asserts credentials is Required<ProviderCredentials> {
  if (!credentials.baseUrl) {
    throw new AIConfigurationError(
      `Missing base URL for Qwen. Set one of: ${getBaseUrlEnvVarNames()}`,
    );
  }

  if (!credentials.apiKey) {
    throw new AIConfigurationError(
      `Missing API key for Qwen. Set one of: ${getApiKeyEnvVarNames()}`,
    );
  }
}
