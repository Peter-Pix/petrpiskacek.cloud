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

## Varianta A — "Live AI Lab" (dashboard)

### Struktura

```
petrpiskacek.cloud/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── timeline/
│   │   │   └── page.tsx
│   │   ├── challenge/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── status/route.ts
│   │   │   └── challenge/route.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── LiveStatus.tsx
│   │   ├── Timeline.tsx
│   │   ├── ChallengeForm.tsx
│   │   └── icons.tsx
│   └── lib/
│       └── challenge.ts
├── public/
├── package.json
└── tsconfig.json
```

### Stránky

| Stránka | Účel |
|---------|------|
| `/` | Live AI Lab — dashboard běžících služeb + hero |
| `/timeline` | Časová osa projektů s progress bary |
| `/challenge` | AI solution generator (wow efekt) |

### Homepage layout

```
┌─────────────────────────────────────────┐
│  Nav: [petrpiskacek.cloud] [Timeline]   │
│        [Challenge] [petrpiskacek.cz]     │
├─────────────────────────────────────────┤
│                                         │
│  "I build AI systems                    │
│   that automate real work."             │
│                                         │
│  Currently experimenting with:          │
│  AI Agents • Knowledge Graphs • MCP     │
│  Docker • LLMs • SEO Automation         │
│                                         │
├─────────────────────────────────────────┤
│  Live AI Lab                            │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Image Generation  ● Running    │    │
│  │ LLM API           ● Online      │    │
│  │ Speech Recognition ● Running    │    │
│  │ OCR               ● Running     │    │
│  │ Workflow Engine   ● Running     │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [Challenge Me]                          │
│                                         │
├─────────────────────────────────────────┤
│  Timeline preview                       │
│  2026                                   │
│  AI Portfolio        ████████████ 100%  │
│  4rap.cz             ████████████ 100%  │
│  Knowledge Graph    ████████████ 100%  │
│  AI Agent            ████████░░░  80%   │
│  SEO Automation      ██████████░  90%   │
│  Voice Models        ██████░░░░░  60%   │
│                                         │
│  [View full timeline →]                 │
│                                         │
├─────────────────────────────────────────┤
│  Footer: © Petr Piskáček                │
│  petrpiskacek.cz · petrpiskacek.cloud   │
└─────────────────────────────────────────┘
```

### Challenge Me flow

1. User napíše: "Build me an AI solution for a logistics company."
2. Pošle se POST na `/api/challenge`
3. OpenRouter streamuje odpověď po sekcích:
   - Architecture
   - Cost Estimate
   - Roadmap
   - Tech Stack
   - Database Design
   - Workflow
4. Dole: "Generated live by Petr's AI stack."

### Live status — reálné vs fake

| Služba | Reálná? | Implementace |
|--------|---------|-------------|
| LLM API | ✅ | OpenRouter health check |
| Image Generation | ❌ | Fake s animací |
| Speech Recognition | ❌ | Fake |
| OCR | ❌ | Fake |
| Workflow Engine | ❌ | Fake |

Stačí pár reálných endpointů. Zbytek fake s ping animací — vypadá to, že něco běží.

### Výhody
- Jasná struktura, každá stránka má účel
- Challenge Me je silný wow efekt
- Live status dává důvěryhodnost
- Timeline ukazuje aktivitu

### Nevýhody
- 3 stránky = víc práce
- Challenge Me potřebuje OpenAI/OpenRouter API klíč
- Live status je většinou fake

---

## Varianta B — "Single Page Terminal" (minimal)

### Koncept

Jedna stránka. Vypadá jako terminál/CLI. Žádné obrázky, žádné karty. Čistě text.

### Homepage

```
┌─────────────────────────────────────────┐
│  petrpiskacek.cloud — AI Infrastructure  │
│  ─────────────────────────────────────  │
│                                         │
│  $ whoami                               │
│  > Petr Piskáček                        │
│  > AI Systems Architect                  │
│  > 20 years in IT                       │
│                                         │
│  $ ./status                             │
│  ┌─────────────────────────────────┐    │
│  │ llm-api          ● online       │    │
│  │ image-gen        ● online       │    │
│  │ speech-rec       ● online       │    │
│  │ ocr              ● online       │    │
│  │ workflow         ● online       │    │
│  └─────────────────────────────────┘    │
│                                         │
│  $ ./timeline --year 2026               │
│  AI Portfolio        [████████████] 100 │
│  4rap.cz             [████████████] 100 │
│  Knowledge Graph     [████████████] 100 │
│  AI Agent            [████████░░░░]  80 │
│  SEO Automation      [██████████░░]  90 │
│  Voice Models        [██████░░░░░░]  60 │
│                                         │
│  $ ./challenge                          │
│  > Build me an AI solution for...       │
│  [type your challenge]                  │
│                                         │
│  [Generated response streams below]     │
│                                         │
│  ─────────────────────────────────────  │
│  petrpiskacek.cz · github.com/Peter-Pix │
└─────────────────────────────────────────┘
```

### Výhody
- Extrémně rychlé na vývoj (1 stránka)
- Unikátní, zapamatovatelné
- Technický vibe — recruiteri to milujou
- Žádné obrázky = rychlé načtení

### Nevýhody
- Méně přístupné pro ne-technické návštěvníky
- Terminál design není pro každého
- Méně prostoru pro detailní popis projektů

---

## Varianta C — "Bento Grid Dashboard" (Apple-style)

### Koncept

Apple-style dashboard. Velké karty v bento gridu. Každá karta = jedna služba/projekt.

### Homepage layout

```
┌─────────────────────────────────────────┐
│  Nav: [petrpiskacek.cloud]              │
├─────────────────────────────────────────┤
│                                         │
│  petrpiskacek.cloud                     │
│  AI Infrastructure & Experiments       │
│                                         │
├─────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐    │
│  │ LLM API      │  │ Image Gen    │    │
│  │ ● Online     │  │ ● Running    │    │
│  │ 200ms avg    │  │ 1.2s avg     │    │
│  │ 1.2k req/d   │  │ 45 req/d     │    │
│  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ Speech Rec   │  │ OCR          │    │
│  │ ● Running    │  │ ● Running    │    │
│  │ 300ms avg    │  │ 800ms avg    │    │
│  └──────────────┘  └──────────────┘    │
│  ┌──────────────────────────────┐      │
│  │ Workflow Engine              │      │
│  │ ● Running                    │      │
│  │ 12 active workflows          │      │
│  └──────────────────────────────┘      │
├─────────────────────────────────────────┤
│  Timeline (horizontal scroll)           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │AI    │ │4rap  │ │KG    │ │Agent │  │
│  │100%  │ │100%  │ │100%  │ │80%   │  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
├─────────────────────────────────────────┤
│  [Challenge Me]                         │
│  ┌─────────────────────────────────┐    │
│  │ Build me an AI solution for...  │    │
│  │ [Generate]                      │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Výhody
- Apple design language — konzistentní s .cz
- Každá služba má vlastní kartu s metrikami
- Vizuálně působivé
- Dobře škálovatelné (přidat/odebrat karty)

### Nevýhody
- Víc CSS práce (bento grid, karty)
- Metriky jsou fake (pokud nemáš reálná data)
- Méně unikátní než terminál varianta

---

## Varianta D — "Hybrid" (doporučená)

### Koncept

Kombinace B + C. Homepage je terminálový hero (unikátní, technický), pod ním bento grid s live statusem (Apple design, konzistentní s .cz).

### Homepage layout

```
┌─────────────────────────────────────────┐
│  Nav: [petrpiskacek.cloud] [Timeline]   │
│        [Challenge] [petrpiskacek.cz]     │
├─────────────────────────────────────────┤
│                                         │
│  $ whoami                               │
│  > Petr Piskáček                        │
│  > I build AI systems                   │
│  > that automate real work.            │
│                                         │
│  Currently experimenting with:          │
│  AI Agents • Knowledge Graphs • MCP     │
│  Docker • LLMs • SEO Automation         │
│                                         │
├─────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐    │
│  │ LLM API      │  │ Image Gen    │    │
│  │ ● Online     │  │ ● Running    │    │
│  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ Speech Rec   │  │ OCR          │    │
│  │ ● Running    │  │ ● Running    │    │
│  └──────────────┘  └──────────────┘    │
│  ┌──────────────────────────────┐      │
│  │ Workflow Engine              │      │
│  │ ● Running                    │      │
│  └──────────────────────────────┘      │
│                                         │
│  [Challenge Me]                          │
│                                         │
├─────────────────────────────────────────┤
│  Timeline preview                       │
│  (progress bary)                        │
│                                         │
│  [View full timeline →]                 │
│                                         │
├─────────────────────────────────────────┤
│  Footer                                 │
└─────────────────────────────────────────┘
```

### Výhody
- Unikátní hero (terminál) + konzistentní design (bento)
- Nejlepší z obou světů
- Technický vibe + Apple elegance
- Dobře škálovatelné

### Nevýhody
- Víc práce než single page
- Dva designové jazyky na jedné stránce (riziko nekonzistence)

---

## Srovnání variant

| Kritérium | A (Dashboard) | B (Terminal) | C (Bento) | D (Hybrid) |
|-----------|:---:|:---:|:---:|:---:|
| **Rychlost vývoje** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Unikátnost** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Konzistence s .cz** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Technický vibe** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Přístupnost** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Škálovatelnost** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Wow efekt** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Celkem** | **24/35** | **26/35** | **24/35** | **28/35** |

---

## Moje doporučení

### Varianta D (Hybrid) — nejlepší poměr unikátnost + konzistence

Terminál hero pro technický vibe, bento grid pro live status (konzistentní s .cz), timeline pro aktivitu, challenge pro wow efekt.

### Alternativa: Varianta B (Terminal) — pokud chceš něco fakt jiného

Rychlejší na vývoj, unikátnější, ale míň konzistentní s .cz.

### Co bych dělal já

Začal bych **Varianta D** — terminál hero + bento live status + timeline + challenge. 3 stránky (/, /timeline, /challenge). ~3 hodiny práce.

---

## Odhad času (Varianta D)

| Úkol | Čas |
|------|-----|
| Inicializace Next.js + kopie design systému | 15 min |
| Layout + metadata + Nav | 15 min |
| Terminál hero sekce | 20 min |
| Bento live status grid | 25 min |
| Timeline stránka | 30 min |
| Challenge Me stránka + API | 45 min |
| API status endpoint | 15 min |
| Deploy na Vercel | 10 min |
| **Celkem** | **~3 hodiny** |
