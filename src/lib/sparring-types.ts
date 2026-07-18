// Datový model pro Sparring — AI architekt co s tebou přemýšlí o projektu.

export type SparringPhase = "input" | "clarify" | "blocks" | "done";

export type BlockKind = "core" | "stack" | "costs" | "timeline";

export type CoreBlock = {
  kind: "core";
  what: string; // 1 věta, CO to je
  forWhom: string; // 1 věta, PRO KOHO
  mainFeature: string; // 1 věta, HLAVNÍ FEATURE
};

export type StackBlock = {
  kind: "stack";
  frontend: string;
  backend: string;
  database: string;
  ai: string;
  infra: string;
};

export type CostsBlock = {
  kind: "costs";
  oneTime: string; // implementace
  monthly: string; // provoz
  mvp: string; // MVP scope
  note?: string; // doplňující poznámka
};

export type TimelineBlock = {
  kind: "timeline";
  phase1: string; // 1-2 týdny
  phase2: string; // 2-4 týdny
  phase3: string; // 1+ měsíc
};

export type Block = CoreBlock | StackBlock | CostsBlock | TimelineBlock;

export type BlockWithMeta = {
  block: Block;
  expanded?: boolean;
  expansion?: string; // rozšířený text po kliknutí "Rozveď"
};

export type ClarifyQuestion = {
  id: string;
  text: string; // otázka pro uživatele
  hint?: string; // volitelný hint
};

export type SparringSession = {
  phase: SparringPhase;
  prompt: string; // původní zadání
  questions: ClarifyQuestion[];
  answers: Record<string, string>;
  blocks: Partial<Record<BlockKind, BlockWithMeta>>;
};
