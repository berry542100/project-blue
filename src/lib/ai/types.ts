export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ProviderCredentials = {
  baseUrl?: string;
  apiKey?: string;
};

export interface AIProvider {
  complete(
    messages: ChatMessage[],
    apiModelId: string,
    credentials: Required<ProviderCredentials>,
  ): Promise<string>;
}
