# petrpiskacek.cloud — AI Technical Lab

Technická laboratoř pro AI systémy, experimenty a infrastrukturu.
Místo, kde recruiteři a klienti vidí, že věci **reálně běží** — ne jen sliby.

## Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Environment variables** (`.env.local`):
   ```env
   OPENROUTER_API_KEY=***
   STABILITY_API_KEY=***
   WHISPER_API_KEY=***
   ```

3. **Run dev server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3111](http://localhost:3111).

## Key Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server (port 3111) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript check (tsc --noEmit) |
| `pnpm test:e2e` | Run Playwright tests |
| `pnpm test:e2e:ui` | Run Playwright in UI mode |

## Deployment
- **Vercel**: Auto-deploy z `main` branch (`.vercel/` je v repu).
- **Manual**: `vercel --prod`.

## Project Structure

```
src/
├── app/               # Next.js pages
│   ├── ai-worker/     # AI Worker demo
│   ├── challenge/     # Challenge Me generator
│   ├── flash-ui/      # Flash UI demo
│   └── api/           # API routes (flash-ui, sparring)
├── components/        # Sdílené komponenty
├── lib/               # Utility (apps, models, track)
└── vendor/ui/         # Sdílené UI (mezistupeň k @piskacek/ui monorepu)
```

## Key Features
- **Live AI Lab**: Status dashboard služeb (část zatím demo/fake, viz ROADMAP).
- **Challenge Me**: AI solution generator (text-only, plán: Mermaid diagramy).
- **Flash UI**: Rychlé generování UI.
- **Sparring**: AI brainstorming partner (block/clarify/expand).
- **AI Worker**: Demo autonomního AI pracovníka.
- **Active Agents** *(plán)*: Logy z OpenClaw agentů jako důkaz práce.

## Design System
- Tailwind 4, `bg-zinc-950`, gold accent `#c8962e`.
- Apple-style komponenty (glass-card, btn-apple, nav-apple, hero-bg).
- Sdílené komponenty ve `src/vendor/ui/` (Footer, SiteSwitcher, icons).
- Konzistentní s `petrpiskacek.cz` a `petrpiskacek.online`.

## Související projekty
- **petrpiskacek.cz** — hlavní vizitka, Doofy chatbot.
- **petrpiskacek.online** — příběh, přesvědčení, blog.
- **Ecosystem Shared UI** (`@piskacek/ui`) — sdílený design balík.

## Stav roadmapy
Viz [`ROADMAP.md`](./ROADMAP.md) pro detaily. Aktuální stav k 26. 8. 2026.
