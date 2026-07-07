import { AIUpstreamError, readResponseErrorBody } from "../errors";
import type { AIProvider, ChatMessage, ProviderCredentials } from "../types";

type OpenAICompatibleResponse = {
  choices: Array<{ message: { content: string } }>;
};

const PROVIDER_NAME = "openai-compatible";

export const openAICompatibleProvider: AIProvider = {
  async complete(
    messages: ChatMessage[],
    apiModelId: string,
    credentials: Required<ProviderCredentials>,
  ) {
    const url = `${credentials.baseUrl}/chat/completions`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.apiKey}`,
      },
      body: JSON.stringify({
        model: apiModelId,
        messages,
        temperature: 0.7,
        response_format: { type: "json_object" },
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

    const data = (await response.json()) as OpenAICompatibleResponse;
    return data.choices[0]?.message?.content ?? "";
  },
};
