import type { AIProvider, ChatMessage, ProviderCredentials } from "../types";

type AnthropicResponse = {
  content: Array<{ type: string; text?: string }>;
};

export const anthropicProvider: AIProvider = {
  async complete(
    messages: ChatMessage[],
    apiModelId: string,
    credentials: Required<ProviderCredentials>,
  ) {
    const baseUrl = credentials.baseUrl ?? "https://api.anthropic.com/v1";
    const systemMessage = messages.find((message) => message.role === "system");
    const conversation = messages.filter((message) => message.role !== "system");

    const response = await fetch(`${baseUrl}/messages`, {
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
      throw new Error("AI request failed");
    }

    const data = (await response.json()) as AnthropicResponse;
    return data.content.find((block) => block.type === "text")?.text ?? "";
  },
};
