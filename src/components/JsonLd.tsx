export default function JsonLd({
  type = "person",
  data,
}: {
  type?: "person" | "service";
  data?: Record<string, unknown>;
}) {
  let schema;

  if (type === "service") {
    schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Autonomní AI pracovník",
      serviceType: "AI automation",
      provider: {
        "@type": "Person",
        name: "Petr Piskáček",
        alternateName: "Peter Pix",
        url: "https://petrpiskacek.cloud",
      },
      areaServed: "CZ",
      description:
        "Nasazení autonomních AI agentů pro české firmy — data, reporting, emaily, obsah. Reálné case studies.",
      ...(data || {}),
    };
  } else {
    schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Petr Piskáček",
      alternateName: "Peter Pix",
      givenName: "Petr",
      familyName: "Piskáček",
      email: "info@petrpiskacek.cz",
      url: "https://petrpiskacek.cloud",
      sameAs: [
        "https://petrpiskacek.cz",
        "https://petrpiskacek.online",
        "https://github.com/Peter-Pix",
      ],
      knowsAbout: [
        "Artificial Intelligence",
        "LLM",
        "AI Agents",
        "Software Development",
        "Automation",
      ],
      description:
        "AI infrastruktura a experimenty. Autonomní AI pracovníci, agenti, automatizace.",
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
