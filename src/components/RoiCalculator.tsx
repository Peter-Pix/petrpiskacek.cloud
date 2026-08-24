"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/track";

interface RoiResult {
  monthlyWaste: number;
  yearlyWaste: number;
  monthlySaving: number;
  netYear1: number;
  roiMonths: number;
  netMonthly: number;
}

/**
 * RoiCalculator — interaktivní kalkulačka úspory pro AI Workera.
 * Port z roi-calculator.html (pay-me-Im-worth-it). Transparentní model.
 *
 * Finanční model: setup se splácí PROGRESIVNĚ z reálných úspor (pay-as-you-save).
 * Klient si nechává 30 % z čisté úspory, zbytek jde na splátku setupu — dokud není
 * zaplacen. Pak si klient nechává 100 %.
 * Riziko nese dodavatel → záruka 100% vrácení peněz do 60 dnů.
 */
export default function RoiCalculator() {
  const [hours, setHours] = useState(20);
  const [people, setPeople] = useState(3);
  const [hourly, setHourly] = useState(350);
  const [coverage, setCoverage] = useState(70);
  const [setup, setSetup] = useState(80000);
  const [monthly, setMonthly] = useState(20000);
  const [tracked, setTracked] = useState(false);

  const trackOnce = (field: string) => {
    if (!tracked) {
      setTracked(true);
      trackEvent("roi_calc_interact", { field });
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      maximumFractionDigits: 0,
    }).format(n);

  const calc = (): RoiResult => {
    const weekly = hours * people * hourly;
    const monthlyWaste = weekly * 4.33;
    const yearlyWaste = monthlyWaste * 12;
    const monthlySaving = monthlyWaste * coverage / 100;
    const yearlyCost = setup + monthly * 12;
    const netYear1 = (yearlyWaste * coverage / 100) - yearlyCost;
    const netMonthly = monthlySaving - monthly;
    const roiMonths = netMonthly > 0 ? setup / netMonthly : 0;
    return { monthlyWaste, yearlyWaste, monthlySaving, netYear1, roiMonths, netMonthly };
  };

  const r = calc();

  // Progresivní splátka: 70 % z čisté úspory jde na setup, dokud není zaplacen.
  const installment = r.netMonthly > 0 ? r.netMonthly * 0.7 : 0;
  const keepForClient = r.netMonthly > 0 ? r.netMonthly * 0.3 : 0;
  const hasSetup = setup > 0 && installment > 0;
  const monthsToPayOff = hasSetup ? Math.ceil(setup / installment) : 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl border p-8" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Hodin týdně na rutině (na osobu)" value={hours} onChange={(v) => { setHours(v); trackOnce("hours"); }} step={1} suffix="h" />
          <Field label="Počet lidí v procesu" value={people} onChange={(v) => { setPeople(v); trackOnce("people"); }} step={1} suffix="" />
          <Field label="Hodinová cena zaměstnance (s overheadem)" value={hourly} onChange={(v) => { setHourly(v); trackOnce("hourly"); }} step={50} suffix="Kč" />
          <Field label="Podíl rutiny, který převezme AI" value={coverage} onChange={(v) => { setCoverage(v); trackOnce("coverage"); }} step={5} suffix="%" />
          <Field label="Jednorázový setup" value={setup} onChange={(v) => { setSetup(v); trackOnce("setup"); }} step={5000} suffix="Kč" />
          <Field label="Měsíční provoz AI Workera" value={monthly} onChange={(v) => { setMonthly(v); trackOnce("monthly"); }} step={1000} suffix="Kč" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ResultCard label="Měsíční ztráta na rutině (bez AI)" value={fmt(r.monthlyWaste)} />
          <ResultCard label="Měsíční úspora s AI Workerem" value={fmt(r.monthlySaving)} accent />
          <ResultCard label="Čistá úspora za 1. rok" value={fmt(r.netYear1)} accent />
          <ResultCard label="Návratnost investice" value={r.roiMonths > 0 ? `~${Math.round(r.roiMonths)} měsíců` : "—"} accent />
        </div>
      </div>

      {/* ══ PROGRESIVNÍ SPLÁCENÍ & ZÁRUKA ══ */}
      <div className="mt-6 rounded-3xl border-2 p-8" style={{ borderColor: "var(--accent)", background: "var(--accent-soft)" }}>
        <h3 className="text-xl font-semibold" style={{ color: "var(--accent)" }}>
          🛡️ Splácíte z vlastních úspor. Bez rizika.
        </h3>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Setup nemusíte zaplatit najednou. Splácíte ho <strong>progresivně z úspor, které AI Worker reálně vygeneruje</strong>.
          70 % z čisté měsíční úspory jde na splátku setupu, zbylých 30 % si necháváte hned. Jakmile je setup zaplacen,
          jde vám už 100 % úspor do kapsy.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ResultCard label="Progresivní splátka setupu (měsíčně)" value={installment > 0 ? fmt(installment) : "—"} accent />
          <ResultCard label="Co vám zůstane hned (měsíčně)" value={keepForClient > 0 ? fmt(keepForClient) : "—"} accent />
          <ResultCard label="Doba splacení setupu" value={monthsToPayOff > 0 ? `~ ${monthsToPayOff} měsíců` : "—"} accent />
          <ResultCard label="Dopad na cashflow (čistá úspora)" value={r.netMonthly > 0 ? fmt(r.netMonthly) : "—"} accent />
        </div>

        <div className="mt-6 rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Pokud to nefunguje — vrátíme vám naprosto všechno.
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Pokud do <strong>60 dnů</strong> neuvidíte měřitelný výsledek, řeknete si, že to je &quot;na prd&quot;,
            nebo zjistíte, že lidé to dělají líp — <strong>vracíme vám 100 % peněz</strong>.
            Žádné malé písmo. Máme jasně měřitelné výsledky, tak si to můžeme dovolit.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, step, suffix }: {
  label: string; value: number; onChange: (n: number) => void; step: number; suffix: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
      <div className="flex items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: "var(--border)" }}>
        <input
          type="number"
          value={value}
          step={step}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent text-base outline-none"
          style={{ color: "var(--text-primary)" }}
        />
        {suffix && <span className="text-sm" style={{ color: "var(--text-muted)" }}>{suffix}</span>}
      </div>
    </label>
  );
}

function ResultCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border p-4" style={{
      borderColor: accent ? "var(--accent)" : "var(--border)",
      background: accent ? "var(--accent-soft)" : "transparent",
    }}>
      <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</div>
      <div className="mt-1 text-2xl font-semibold" style={{ color: accent ? "var(--accent)" : "var(--text-primary)" }}>
        {value}
      </div>
    </div>
  );
}
