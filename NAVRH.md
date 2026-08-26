# petrpiskacek.cloud — Návrh

## Účel

Technická laboratoř. Živé AI služby, architektury, experimenty, monitoring a ukázky infrastruktury.
Místo, kde recruiter/klient vidí, že něco reálně běží — ne jen sliby.

## Design

Identický designový systém s petrpiskacek.cz:
- Tailwind 4 theme (bg-zinc-950, gold #c8962e)
- CSS proměnné (--bg, --surface, --gold, atd.)
- Stejné komponenty (glass-card, btn-apple, nav-apple, hero-bg)
- Stejná typografie (SF Pro, headline-xl/lg/md)
- Stejný layout (container-apple, section-apple)

Rozdíl: .cloud bude techničtější tón, víc dat, víc live indikátorů.
Brand recognition > variace — zlatá zůstává.

---

## Zvolená varianta: D — "Hybrid" (terminál hero + bento grid)

Kombinace terminálového hero (unikátní, technický vibe) + bento grid s live statusem (konzistentní s .cz).

- Unikátní hero (terminál) + konzistentní design (bento)
- Technický vibe + Apple elegance
- Dobře škálovatelné
- Riziko: dva designové jazyky na jedné stránce → potřeba citlivě propojit

> ⚠️ **Poznámka k aktuálnímu stavu:** Homepage má bento grid, ale **terminál hero zatím chybí** — je to missing kus plánu (viz sekce "Současná implementace" níže).

---

## Současná implementace (stav k 26. 8. 2026)

### ✅ Live / Hotovo
- **Design System**: Tailwind 4, gold accent (#c8962e), Apple-style komponenty.
- **Stránky**: `/`, `/ai-worker`, `/challenge`, `/flash-ui`.
- **API route**: `/api/flash-ui/random-prompt`, `/api/sparring/{block,clarify,expand,random-prompt}`.
- **E2E testy**: Playwright testy pro stránky i API route.
- **Vendor UI**: Sdílené komponenty v `src/vendor/ui` (mezistupeň k monorepu).
- **SEO**: `robots.ts`, `sitemap.ts`.

### ❌ Chybí oproti plánu (priority)
| Feature | Stav | Priorita |
|---------|------|----------|
| Live Status API (`/api/status`) | Není implementováno | 🔥 High |
| Reálné endpointy (Image Gen, Speech Rec, OCR) | Fake/placeholder | 🔥 High |
| Terminál hero | Chybí na homepage | 🔥 High |
| Timeline stránka (`/timeline`) | Není, jen statický preview na homepage | High |
| Challenge Me: Mermaid diagramy | Není (text-only) | Medium |
| Active Agents feed | Není | Medium |
| PDF export z Challenge | Není | Low |

### 🔄 Změny oproti původnímu plánu
- **Design**: Aktuální homepage je mix terminálu + bento (Varianta D), ale terminál hero chybí.
- **Timeline**: Preview na homepage je hardcoded, ne dynamická stránka.
- **Challenge Me**: Funguje, ale výstup je textový (bez Mermaid/PDF).
- **Flash UI + AI Worker**: Přidáno (nebylo v původním návrhu) — rozšířeno o demo-stánky schopností.

---

## Stránky

| Stránka | Účel | Stav |
|---------|------|------|
| `/` | Hybrid homepage — terminál hero + live status + timeline preview | ✅ (bez terminál hero) |
| `/ai-worker` | Demo autonomního AI pracovníka | ✅ |
| `/challenge` | AI solution generator (wow efekt) | ✅ (text-only) |
| `/flash-ui` | Demo Flash UI (rychlé generování UI) | ✅ |
| `/api/*` | Backend: flash-ui, sparring, (status chybí) | ✅ / ❌ |

---

## Live status — reálné vs fake

| Služba | Reálná? | Implementace |
|--------|---------|-------------|
| LLM API | ✅ | OpenRouter health check |
| Image Generation | ❌ | Fake s animací |
| Speech Recognition | ❌ | Fake |
| OCR | ❌ | Fake |
| Workflow Engine | ❌ | Fake |

**Cíl:** Přidat reálné endpointy + `/api/status` pro live health-check. Ideálně aspoň pár reálných služeb, zbytek může být fake s jasným označením "demo".

---

## Architektura API (budoucí)

```
/api
├── status/          → health-check všech služeb (chybí)
├── challenge/       → solution generator (text-only, chce Mermaid)
├── flash-ui/        → random-prompt (hotovo)
└── sparring/        → block/clarify/expand (hotovo)
```

---

## Co dál (viz ROADMAP.md)

1. **Live Status API** — `/api/status` pro reálné health-checky (největší wow efekt za nejmíň práce).
2. **Reálné endpointy** — Image Gen + Speech Rec + OCR.
3. **Terminál hero** — dokončit Variantu D.
4. **Timeline stránka** — dynamická, napojená na GitHub API.
5. **Active Agents feed** — logy z OpenClaw agentů jako "důkaz práce".
