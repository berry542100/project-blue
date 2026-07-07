import { getApiModelId } from "@/config/models";
import {
  assertModelCredentials,
  getModelCredentials,
} from "./credentials";
import { openAICompatibleProvider } from "./providers/openai-compatible";
import { DECISION_SYSTEM_PROMPT } from "./system-prompt";
import type { ChatMessage } from "./types";

export async function callAI(userInput: string) {
  const credentials = getModelCredentials();
  assertModelCredentials(credentials);

  const apiModelId = getApiModelId();

  console.info(
    "[ProjectBlue AI]",
    JSON.stringify({
      event: "call_ai_start",
      model: "qwen",
      apiModelId,
      baseUrl: credentials.baseUrl,
      hasApiKey: Boolean(credentials.apiKey),
    }),
  );

  const messages: ChatMessage[] = [
    { role: "system", content: DECISION_SYSTEM_PROMPT },
    { role: "user", content: userInput },
  ];

  return openAICompatibleProvider.complete(messages, apiModelId, credentials);
}
