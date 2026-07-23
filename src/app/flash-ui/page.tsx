import { Metadata } from "next";
import Nav from "@/components/Nav";
import FlashUIForm from "@/components/FlashUIForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Flash UI — petrpiskacek.cloud",
  description:
    "Generuj UI komponenty pomocí AI. Napiš prompt a sleduj, jak Qwen 2.5 kreslí HTML v reálném čase.",
};

export default function FlashUIPage() {
  return (
    <main className="relative">
      <Nav />
      <FlashUIForm />
      <Footer />
    </main>
  );
}
