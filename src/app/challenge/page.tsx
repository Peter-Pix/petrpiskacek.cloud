import { Metadata } from "next";
import Nav from "@/components/Nav";
import SparringForm from "@/components/SparringForm";
import { Footer } from "@piskacek/ui";

export const metadata: Metadata = {
  title: "Promysli to lépe — Rychlý návrh projektu",
  description:
    "Zadejte projekt. Ukážu, jak na to. Expertíza, náklady, plán. Vše, co potřebujete vědět.",
};

export default function ChallengePage() {
  return (
    <main className="relative">
      <Nav />
      <SparringForm />
      <Footer />
    </main>
  );
}
