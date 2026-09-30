import { OLLAMA_URL } from "@/lib/models";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  response_format?: { type: "json_object" };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ChatCompletionResponse {
  content: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

export class OllamaApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public responseText?: string
  ) {
    super(message);
    this.name = "OllamaApiError";
  }
}

export async function chatCompletion(options: ChatOptions): Promise<ChatCompletionResponse> {
  const apiKey = process.env.OLLAMA_API_KEY;
  if (!apiKey) {
    throw new OllamaApiError("OLLAMA_API_KEY není nastaven");
  }

  const body: Record<string, unknown> = {
    model: options.model || "deepseek-v4.1-flash",
    messages: options.messages,
    stream: options.stream ?? false,
  };

  if (options.temperature !== undefined) body.temperature = options.temperature;
  if (options.max_tokens !== undefined) body.max_tokens = options.max_tokens;
  if (options.response_format) body.response_format = options.response_format;

  // Přenes libovolné další optiony (např. pro specifické modely), ale nepřepisuj známá pole
  for (const [key, value] of Object.entries(options)) {
    if (!["model", "messages", "temperature", "max_tokens", "stream", "response_format"].includes(key)) {
      body[key] = value;
    }
  }

  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text().catch(() => "");

  if (!res.ok) {
    throw new OllamaApiError(
      `Ollama vrátila ${res.status}`,
      res.status,
      text
    );
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new OllamaApiError("Ollama nevrátila platný JSON", res.status, text);
  }

  const content = data?.choices?.[0]?.message?.content || data?.message?.content || "";

  return {
    content,
    usage: data?.usage,
  };
}
