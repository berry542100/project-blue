import {
  getSharedApiKey,
  getSharedBaseUrl,
  SHARED_API_KEY_ENV_VARS,
  SHARED_BASE_URL_ENV_VARS,
} from "@/config/models";
import { AIConfigurationError } from "./errors";
import type { ProviderCredentials } from "./types";

export function getModelCredentials(): ProviderCredentials {
  return {
    baseUrl: getSharedBaseUrl(),
    apiKey: getSharedApiKey(),
  };
}

export function assertModelCredentials(
  credentials: ProviderCredentials,
): asserts credentials is Required<ProviderCredentials> {
  if (!credentials.baseUrl) {
    throw new AIConfigurationError(
      `Missing API base URL. Set ${SHARED_BASE_URL_ENV_VARS.join(", ")}`,
    );
  }

  if (!credentials.apiKey) {
    throw new AIConfigurationError(
      `Missing API key. Set ${SHARED_API_KEY_ENV_VARS.join(", ")}`,
    );
  }
}
