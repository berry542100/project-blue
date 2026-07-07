import { AIUpstreamError, readResponseErrorBody } from "../errors";
import type { AIProvider, ChatMessage, ProviderCredentials } from "../types";

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

const PROVIDER_NAME = "google";

function toGeminiContents(messages: ChatMessage[]) {
  return messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));
}

export const googleProvider: AIProvider = {
  async complete(
    messages: ChatMessage[],
    apiModelId: string,
    credentials: Required<ProviderCredentials>,
  ) {
    const baseUrl =
      credentials.baseUrl ?? "https://generativelanguage.googleapis.com/v1beta";
    const systemMessage = messages.find((message) => message.role === "system");
    const url = `${baseUrl}/models/${apiModelId}:generateContent?key=${credentials.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: systemMessage
          ? { parts: [{ text: systemMessage.content }] }
          : undefined,
        contents: toGeminiContents(messages),
        generationConfig: {
          temperature: 0.7,
        },
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

    const data = (await response.json()) as GeminiResponse;
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  },
};
