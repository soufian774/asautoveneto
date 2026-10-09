import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Handshake, Wrench } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { SiteLayout } from "@/components/SiteLayout";
import { CarCard } from "@/components/CarCard";
import { fetchCars } from "@/lib/cars-queries";
import { canonicalUrl } from "@/lib/seo";

export const Route = createFileRoute("/")({
  loader: () => fetchCars(),
  head: () => ({
    meta: [
      { title: "AS AUTO — Auto usate a Portogruaro (VE), selezionate e garantite" },
      { name: "description", content: "Concessionaria di auto usate a Portogruaro (VE): usato garantito, prezzi trasparenti e finanziamenti su misura." },
      { property: "og:title", content: "AS AUTO — Auto usate a Portogruaro (VE), selezionate e garantite" },
      { property: "og:description", content: "Usato garantito, prezzi trasparenti e finanziamenti su misura." },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/") }],
  }),
  component: Index,
});

const perks = [
  { icon: BadgeCheck, t: "Km certificati", d: "Storico e tagliandi verificati." },
  { icon: Handshake, t: "Permute e finanziamenti", d: "Soluzioni su misura per te." },
  { icon: Wrench, t: "Controllo 100 punti", d: "Ogni auto ispezionata a fondo." },
];

function Index() {
  const cars = Route.useLoaderData();
  return (
    <SiteLayout>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-fade-overlay" />
        <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 md:py-40">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Concessionaria</p>
          <h1 className="max-w-2xl text-5xl font-extrabold leading-[0.95] sm:text-6xl md:text-7xl">
            La tua prossima auto ti aspetta.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">Usato selezionato, prezzi chiari e nessuna sorpresa.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/auto" className="rounded-full bg-primary px-8 py-4 text-center font-semibold text-primary-foreground shadow-glow transition hover:bg-primary/90">
              Vedi le auto in vendita
            </Link>
            <Link to="/contatti" className="rounded-full border px-8 py-4 text-center font-semibold transition hover:bg-accent">
              Contattaci
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:px-6 sm:grid-cols-3">
        {perks.map((p) => (
          <div key={p.t} className="rounded-2xl border bg-card p-5">
            <p.icon className="h-7 w-7 text-primary" />
            <p className="mt-3 font-semibold">{p.t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold sm:text-4xl">Auto disponibili</h2>
          <p className="mt-2 text-muted-foreground">{cars.length} veicoli in vendita.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((c) => <CarCard key={c.id} car={c} />)}
        </div>
        {cars.length === 0 && <p className="py-10 text-center text-muted-foreground">Nessuna auto disponibile al momento.</p>}
      </section>
    </SiteLayout>
  );
}
