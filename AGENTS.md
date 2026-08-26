# AI Agents on petrpiskacek.cloud

Tento soubor popisuje, jak využít OpenClaw agenty jako **důkaz práce** na `.cloud`.

## OpenClaw Agents as a Feature

### Active Agents Feed
Ukázat logy z běžících agentů jako "důkaz práce" — místo statických statusů.
- Příklad: "Agent KimiFix právě opravil bug v projektu X."
- Příklad: "StagnationDetector našel 3 neaktivní projekty."
- Zdroj: logy z `crisis-management` a `housekeeper`.

### Agent Dashboard
Vytvořit stránku `/agents` s přehledem běžících agentů a jejich aktivitou.

## Jak to integrovat

1. **Expose Agent Logs**
   - Vytvořit API endpoint `/api/agents/activity`, který čte logy z `~/.openclaw/workspace/memory/*.md`.
2. **Display na Homepage**
   - Přidat sekci "Active Agents" s live feedem.
3. **Link na Projekty**
   - Ukázat, jak agenti pracují na reálných projektech (např. `rap-knowledge-graph`).

## Příklad použití agentů

| Agent | Projekt | Účel |
|-------|---------|------|
| KimiFix | crisis-management | Automatické opravy kódu |
| StagnationDetector | housekeeper | Detekce neaktivních projektů |
| ProductManager | projects-management | AI PM pro projekty |
| Strateg | crisis-management | Strategická analýza |
| SecurityCop | crisis-management | Bezpečnostní audit |

## Pravidla

- **Nikdy nedeployovat na produkci bez explicitního povolení uživatele.**
- **Nikdy `openclaw update` bez souhlasu.**
- Vždy ověřit realitu dat (AGENTS.md může být zastaralý) — číst live stav.
- Před změnou configů/schedulerů inspect existing state, preserve/merge default.
- Working tree nikdy nenechat dlouho dirty.
