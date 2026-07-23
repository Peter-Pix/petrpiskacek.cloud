import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import LiveStatus from "@/components/LiveStatus";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <LiveStatus />
      <Footer />
    </main>
  );
}
