// AI model registry — single source of truth for all LLM endpoints.
// Pokud chceš přepnout model, změň tady. Žádné hardcoded stringy v routes.

export const MODELS = {
  // Flash UI — generování HTML přes OpenAI-compatible /v1/chat/completions
  flashUI: "deepseek-v4.1-flash",

  // Sparring + Challenge page — multipurpose: clarify, expand, block generation
  sparring: "deepseek-v4.1-flash",

  // Random prompts — kreativní nápady pro Flash UI a Sparring
  randomPrompt: "deepseek-v4.1-flash",
} as const;

export type ModelKey = keyof typeof MODELS;

// Fallback chain (provider → next provider)
export const FALLBACKS = {
  // Sparring: Ollama cloud → OpenRouter
  sparring: ["ollama:cloud", "openrouter:google/gemini-2.5-flash"] as const,
  // Expand: Ollama cloud → OpenRouter
  sparringExpand: ["ollama:cloud", "openrouter:google/gemini-2.5-flash"] as const,
} as const;

// OpenRouter API
export const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Ollama Cloud OpenAI-compatible endpoint
export const OLLAMA_URL = "https://ollama.com/v1/chat/completions";

// Default generation params
export const DEFAULT_PARAMS = {
  temperature: 0.7,
  max_tokens: 2000,
  stream: false,
} as const;
