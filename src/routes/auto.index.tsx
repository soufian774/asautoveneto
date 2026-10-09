import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { CarCard } from "@/components/CarCard";
import { fetchCars } from "@/lib/cars-queries";
import { canonicalUrl } from "@/lib/seo";

export const Route = createFileRoute("/auto/")({
  loader: () => fetchCars(),
  head: () => ({
    meta: [
      { title: "Auto usate in vendita a Portogruaro (VE) — AS AUTO" },
      { name: "description", content: "Tutte le auto usate in vendita da AS AUTO a Portogruaro (VE), con prezzi, chilometri e dettagli." },
      { property: "og:title", content: "Auto usate in vendita a Portogruaro (VE) — AS AUTO" },
      { property: "og:description", content: "Sfoglia il nostro parco auto con prezzi e dettagli." },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/auto") }],
  }),
  component: AutoList,
});

const selectCls = "h-12 rounded-xl border bg-card px-4 text-sm outline-none focus:border-primary";

function AutoList() {
  const cars = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [carb, setCarb] = useState("");
  const [sort, setSort] = useState("recenti");
  const carburanti = [...new Set(cars.map((c) => c.carburante))];

  const list = useMemo(() => {
    const r = cars.filter(
      (c) =>
        (!q || `${c.marca} ${c.modello} ${c.versione}`.toLowerCase().includes(q.toLowerCase())) &&
        (!carb || c.carburante === carb),
    );
    if (sort === "prezzo-asc") r.sort((a, b) => a.prezzo - b.prezzo);
    if (sort === "prezzo-desc") r.sort((a, b) => b.prezzo - a.prezzo);
    if (sort === "km") r.sort((a, b) => a.km - b.km);
    if (sort === "recenti") r.sort((a, b) => b.anno - a.anno);
    return r;
  }, [q, carb, sort]);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Auto in vendita</h1>
        <p className="mt-2 text-muted-foreground">{list.length} veicoli disponibili</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca marca o modello" className={`${selectCls} w-full pl-11`} />
          </div>
          <select value={carb} onChange={(e) => setCarb(e.target.value)} className={selectCls}>
            <option value="">Tutti i carburanti</option>
            {carburanti.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectCls}>
            <option value="recenti">Più recenti</option>
            <option value="prezzo-asc">Prezzo crescente</option>
            <option value="prezzo-desc">Prezzo decrescente</option>
            <option value="km">Meno km</option>
          </select>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => <CarCard key={c.id} car={c} />)}
        </div>
        {list.length === 0 && <p className="py-20 text-center text-muted-foreground">Nessuna auto trovata.</p>}
      </section>
    </SiteLayout>
  );
}
