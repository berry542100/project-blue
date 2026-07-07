import { AIUpstreamError, readResponseErrorBody } from "../errors";
import type { AIProvider, ChatMessage, ProviderCredentials } from "../types";

type AnthropicResponse = {
  content: Array<{ type: string; text?: string }>;
};

const PROVIDER_NAME = "anthropic";

export const anthropicProvider: AIProvider = {
  async complete(
    messages: ChatMessage[],
    apiModelId: string,
    credentials: Required<ProviderCredentials>,
  ) {
    const baseUrl = credentials.baseUrl ?? "https://api.anthropic.com/v1";
    const systemMessage = messages.find((message) => message.role === "system");
    const conversation = messages.filter((message) => message.role !== "system");
    const url = `${baseUrl}/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": credentials.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: apiModelId,
        max_tokens: 2048,
        system: systemMessage?.content,
        messages: conversation.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      }),
    });

    if (!response.ok) {
      const responseBody = await readResponseErrorBody(response);
      throw new AIUpstreamError(
        `Upstream ${PROVIDER_NAME} request failed with status ${response.status}`,
        PROVIDER_NAME,
        response.status,
        responseBody,
      );
    }

    const data = (await response.json()) as AnthropicResponse;
    return data.content.find((block) => block.type === "text")?.text ?? "";
  },
};
