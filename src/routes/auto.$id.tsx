import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Phone } from "lucide-react";
import { CarGallery } from "@/components/CarGallery";
import { SiteLayout } from "@/components/SiteLayout";
import { formatKm, formatPrice } from "@/data/cars";
import { fetchCarById } from "@/lib/cars-queries";
import { canonicalUrl, siteUrl } from "@/lib/seo";

export const Route = createFileRoute("/auto/$id")({
  loader: async ({ params }) => {
    const car = await fetchCarById({ data: params.id });
    if (!car) throw notFound();
    return { car };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Auto non trovata — AS AUTO" }, { name: "robots", content: "noindex" }] };
    const { car } = loaderData;
    const t = `${car.marca} ${car.modello} ${car.versione} — ${formatPrice(car.prezzo)} | AS AUTO`;
    const d = `${car.anno}, ${formatKm(car.km)}, ${car.carburante}, ${car.cambio}. ${car.descrizione}`;
    const pageUrl = canonicalUrl(`/auto/${params.id}`);
    const image = car.immagine ? canonicalUrl(car.immagine) : undefined;

    const vehicleSchema = {
      "@context": "https://schema.org",
      "@type": "Vehicle",
      name: `${car.marca} ${car.modello} ${car.versione}`,
      brand: car.marca,
      model: car.modello,
      vehicleModelDate: String(car.anno),
      mileageFromOdometer: { "@type": "QuantitativeValue", value: car.km, unitCode: "KMT" },
      fuelType: car.carburante,
      vehicleTransmission: car.cambio,
      ...(image ? { image } : {}),
      offers: {
        "@type": "Offer",
        price: car.prezzo,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: pageUrl,
      },
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Auto in vendita", item: canonicalUrl("/auto") },
        { "@type": "ListItem", position: 3, name: `${car.marca} ${car.modello}`, item: pageUrl },
      ],
    };

    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:url", content: pageUrl },
        ...(image ? [{ property: "og:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: pageUrl }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(vehicleSchema) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema) },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="py-32 text-center">
        <h1 className="text-3xl font-bold">Auto non trovata</h1>
        <Link to="/auto" className="mt-4 inline-block text-primary">Torna alle auto</Link>
      </div>
    </SiteLayout>
  ),
  component: CarDetail,
});

function CarDetail() {
  const { car } = Route.useLoaderData();
  const foto = car.foto.length > 0 ? car.foto : car.immagine ? [car.immagine] : [];
  const specs = [
    ["Anno", car.anno], ["Chilometri", formatKm(car.km)], ["Carburante", car.carburante], ["Cambio", car.cambio],
    ["Potenza", `${car.potenzaCv} CV`], ["Colore", car.colore], ["Carrozzeria", car.carrozzeria], ["Porte", car.porte],
  ];
  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link to="/auto" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Tutte le auto
        </Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <CarGallery photos={foto} alt={`${car.marca} ${car.modello}`} />
            <h2 className="mt-10 text-2xl font-bold">Descrizione</h2>
            <p className="mt-3 text-muted-foreground">{car.descrizione}</p>
            <h2 className="mt-10 text-2xl font-bold">Optional</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {car.optional.map((o) => (
                <li key={o} className="flex items-center gap-3"><Check className="h-4 w-4 shrink-0 text-primary" />{o}</li>
              ))}
            </ul>
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border bg-card p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{car.marca}</p>
              <h1 className="text-3xl font-extrabold">{car.modello}</h1>
              <p className="text-muted-foreground">{car.versione}</p>
              <p className="mt-6 font-display text-4xl font-bold text-primary">{formatPrice(car.prezzo)}</p>
              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border">
                {specs.map(([k, v]) => (
                  <div key={k as string} className="bg-card p-3">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <a href="tel:+393516600049" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-primary py-4 font-semibold text-primary-foreground shadow-glow hover:bg-primary/90">
                <Phone className="h-4 w-4" /> Chiama per info
              </a>
              <Link to="/contatti" className="mt-3 block rounded-full border py-4 text-center font-semibold hover:bg-accent">
                Richiedi un appuntamento
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
