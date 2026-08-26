# Ekosystém petrpiskacek — Roadmapa

## Stav k 26. 8. 2026

Všechny tři weby:
- ✅ Live na vlastních doménách
- ✅ Jednotný design system (Tailwind 4, gold #c8962e, Apple-style)
- ✅ SiteSwitcher — rychlé přepínání mezi weby
- ✅ .cz: Doofy chatbot s pamětí
- ✅ .cloud: Terminál hero (❌ chybí), Live AI Lab, Timeline, Challenge Me
- ✅ .online: Příběh, přesvědčení, projekty, blog, chatbot dvojník
- ✅ .online: **Blog live** (21+ článků, nový post k AI agentům 26. 8.)

---

## Fáze 1 — Reálné endpointy a quick wins (1-2 týdny)

### .cloud — Reálné služby 🔥 (nejvyšší priorita)
- [ ] **Live Status API** — `/api/status` endpoint pro reálné health-checky (OpenRouter, Stability AI, Whisper). Nahradit fake statusy na homepage.
- [ ] **Image generation** — nasadit reálný endpoint (Stability AI / Replicate API). Už nebude fake.
- [ ] **Speech recognition** — nasadit Whisper endpoint. Už nebude fake.
- [ ] **OCR** — nasadit Tesseract / Google Vision. Už nebude fake.
- [ ] **Workflow Engine** — napojit na n8n nebo Temporal, ukázat reálné workflow.

### .cloud — UX a dokončení Varianty D
- [ ] **Terminál hero** — přidat terminálovou sekci na homepage (unikátní vibe, chybí oproti plánu).
- [ ] **Challenge Me: Mermaid diagramy** — generovat vizuální architekturu místo textu.
- [ ] **Timeline stránka** — dynamická stránka s progress bary (napojit na GitHub API).

### .cloud — Důkaz práce přes agenty
- [ ] **Active Agents feed** — ukázat logy z OpenClaw agentů (`crisis-management`, `housekeeper`) jako "důkaz práce". Např. "Agent KimiFix právě opravil bug v projektu X."
- [ ] **`/api/agents/activity`** — endpoint čtoucí logy z `~/.openclaw/workspace/memory/*.md`.

### .cz / .online — Cross-site
- [ ] **Doofy paměť napříč weby** — sdílená cookie/localStorage, aby si chatbot pamatoval kontext mezi `.cz` a `.online`.
- [ ] **Doofy zná .online a .cloud** — přidat informace o webech do promptu.
- [ ] **Vylepšená detekce konverze** — Doofy pozná, kdy je uživatel ready, a otevře kalendář/email.

---

## Fáze 2 — Propojení a automatizace (2-4 týdny)

### Sdílená infrastruktura
- [ ] **Monorepo** — všechny tři weby v jednom repu s `packages/ui` pro sdílené komponenty (Nav, Footer, SiteSwitcher, icons, CSS). Mezistupeň: `src/vendor/ui` (již funguje).
- [ ] **Sdílený design token** — jeden CSS soubor importovaný do všech tří webů.
- [ ] **Sdílený chatbot backend** — jeden API endpoint na .cloud, obsluhuje Doofyho i dvojníka, liší se jen promptem.

### Automatizace
- [ ] **Auto-deploy z GitHubu** — push na main → automatický deploy na Vercel (již částečně funguje přes `.vercel/`).
- [ ] **Health monitoring** — endpoint kontrolující všechny tři weby, notifikace při výpadku.
- [ ] **Analytika** — nasadit Plausible / Umami (self-hosted). Žádný Google Analytics.

### Cross-site features
- [ ] **Sdílená paměť** — uživatel mluví s Doofym na .cz, přijde na .online, chatbot ví, kdo je.
- [ ] **Jednotné přihlášení** — pokud by někdy bylo potřeba (zatím ne).

---

## Fáze 3 — Wow efekty (1-2 měsíce)

### Challenge Me 2.0
- [ ] **Mermaid diagramy** — místo textové architektury vizuální diagram.
- [ ] **Export PDF** — vygenerované řešení jde stáhnout jako PDF.
- [ ] **Historie** — uživatel vidí svá předchozí zadání a řešení.
- [ ] **Více modelů** — přepínač: Claude / GPT-4o / Gemini.

### Live AI Lab 2.0
- [ ] **Reálné metriky** — místo fake "1.2s avg" reálná latence z posledních 100 requestů.
- [ ] **Grafy** — vývoj latence za posledních 24h (Chart.js / Recharts).
- [ ] **Webhook status** — notifikace při pádu služby.

### Timeline 2.0
- [ ] **GitHub aktivita** — automaticky tahat commity z GitHubu na timeline.
- [ ] **Live progress** — propojit s GitHub Projects / Linear.

### .online — Interaktivní prvky
- [ ] **Čtení s progresem** — ukazatel pozice v dlouhých textech.
- [ ] **Audio verze** — tlačítko "Přehrát" pro každý text (voice cloning).
- [ ] **Newsletter** — formulář "Dej mi vědět, když napíšu novej článek."

---

## Fáze 4 — Škálování (3+ měsíce)

### Nové weby
- [ ] **petrpiskacek.online → anglická verze** — celý web v angličtině pro zahraniční klienty.
- [ ] **petrpiskacek.io** — API dokumentace, technické specifikace, open source projekty.

### AI funkce
- [ ] **Doofy na všech webech** — nejen na .cz, ale i na .cloud a .online.
- [ ] **Multi-agentní systém** — Doofy, dvojník, challenge generator — každý samostatný agent spolupracující.
- [ ] **Vlastní fine-tuned model** — natrénovat model na Petrovi textech.

### Monetizace (volitelné)
- [ ] **Placené konzultace** — booking přes Calendly, platba přes Stripe.
- [ ] **Challenge Me PRO** — delší výstupy, export, historie za předplatné.
- [ ] **API přístup** — platný přístup k live endpointům pro B2B.

---

## Co bych dělal jako první

1. **Live Status API** — `/api/status`, největší wow efekt za nejmíň práce.
2. **Reálné endpointy na .cloud** — Image generation + speech recognition.
3. **Terminál hero** — dokončit Variantu D na homepage.
4. **Active Agents feed** — ukázat živé logy z agentů, unikátní důkaz práce.
5. **Monorepo** — ušetří čas při každé změně designu.

---

## Co NEdělat (zatím)

- ❌ Vlastní fine-tuned model — drahý, složitej, zatím zbytečnej.
- ❌ Newsletter — dokud nemáš co pravidelně psát.
- ❌ Placené funkce — dokud není jasné, jestli o to je zájem.
- ❌ Anglická verze — dokud není obsah hotový česky.
