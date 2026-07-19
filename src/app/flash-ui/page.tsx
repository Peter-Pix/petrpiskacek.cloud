import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Flash UI — petrpiskacek.cloud",
  description: "Generuj UI komponenty pomocí AI. Napiš prompt a sleduj, jak DeepSeek V4 Flash kreslí.",
};

export default function FlashUIPage() {
  return (
    <main className="relative min-h-screen bg-black text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← zpět na .cloud
          </Link>
          <span className="text-xs text-zinc-600">DeepSeek V4 Flash</span>
        </div>
        <iframe
          src="/flash-ui/dist/index.html"
          className="w-full border-0"
          style={{ height: "calc(100vh - 100px)", borderRadius: "12px" }}
          title="Flash UI"
        />
      </div>
    </main>
  );
}
