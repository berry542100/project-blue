import type { ProviderId } from "@/config/models";
import type { AIProvider } from "./types";
import { anthropicProvider } from "./providers/anthropic";
import { googleProvider } from "./providers/google";
import { openAICompatibleProvider } from "./providers/openai-compatible";

const providerRegistry: Record<ProviderId, AIProvider> = {
  "openai-compatible": openAICompatibleProvider,
  anthropic: anthropicProvider,
  google: googleProvider,
};

export function getProviderImplementation(providerId: ProviderId): AIProvider {
  return providerRegistry[providerId];
}
