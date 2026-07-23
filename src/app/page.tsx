import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import AppGrid from "@/components/AppGrid";
import LiveStatus from "@/components/LiveStatus";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <AppGrid />
      <LiveStatus />
      <Footer />
    </main>
  );
}
