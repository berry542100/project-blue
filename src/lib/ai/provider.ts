import {
  getApiModelId,
  getModelDefinition,
  type ModelId,
} from "@/config/models";
import {
  assertModelCredentials,
  getModelCredentials,
} from "./credentials";
import { getProviderImplementation } from "./registry";
import { DECISION_SYSTEM_PROMPT } from "./system-prompt";
import type { ChatMessage } from "./types";

export async function callAI(userInput: string, modelId: ModelId) {
  const model = getModelDefinition(modelId);
  const credentials = getModelCredentials(modelId);
  assertModelCredentials(modelId, credentials);

  const apiModelId = getApiModelId(modelId);
  const provider = getProviderImplementation(model.provider);

  const messages: ChatMessage[] = [
    { role: "system", content: DECISION_SYSTEM_PROMPT },
    { role: "user", content: userInput },
  ];

  return provider.complete(messages, apiModelId, credentials);
}
