// AI model registry — single source of truth for all LLM endpoints.
// Pokud chceš přepnout model, změň tady. Žádné hardcoded stringy v routes.

export const MODELS = {
  // Flash UI — streaming HTML, rychlý, levný
  flashUI: "deepseek-v4-flash",

  // Sparring — multipurpose: clarify, expand, block generation
  sparring: "gpt-oss:20b",

  // Challenge — solution architect, kvalitní Markdown
  challenge: "anthropic/claude-3.5-sonnet",

  // Random prompts — kreativní nápady, méně konzistentní
  randomPrompt: "gpt-oss:20b",
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
export const OLLAMA_URL = "https://ollama.com/api/chat";

// Default generation params
export const DEFAULT_PARAMS = {
  temperature: 0.7,
  max_tokens: 2000,
  stream: true,
} as const;
