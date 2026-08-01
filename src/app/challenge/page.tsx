import { Metadata } from "next";
import Nav from "@/components/Nav";
import SparringForm from "@/components/SparringForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Challenge AI — petrpiskacek.cloud",
  description:
    "Zadej mi projektový prompt a já ti ukážu, jak bych na to šel. Architektura, stack, náklady, roadmapa.",
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
