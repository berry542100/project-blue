import type { AIProvider, ChatMessage, ProviderCredentials } from "../types";

type OpenAICompatibleResponse = {
  choices: Array<{ message: { content: string } }>;
};

export const openAICompatibleProvider: AIProvider = {
  async complete(
    messages: ChatMessage[],
    apiModelId: string,
    credentials: Required<ProviderCredentials>,
  ) {
    const response = await fetch(`${credentials.baseUrl}/chat/completions`, {
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
      throw new Error("AI request failed");
    }

    const data = (await response.json()) as OpenAICompatibleResponse;
    return data.choices[0]?.message?.content ?? "";
  },
};
