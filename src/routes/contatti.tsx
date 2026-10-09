import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { canonicalUrl } from "@/lib/seo";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — AS AUTO, Portogruaro (VE)" },
      { name: "description", content: "Contatta AS AUTO a Portogruaro (VE) per informazioni, appuntamenti, permute e finanziamenti." },
      { property: "og:title", content: "Contatti — AS AUTO, Portogruaro (VE)" },
      { property: "og:description", content: "Vieni a trovarci o scrivici per qualsiasi informazione." },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/contatti") }],
  }),
  component: Contatti,
});

function Contatti() {
  const info = [
    { icon: Phone, t: "+39 351 660 0049", href: "tel:+393516600049" },
    { icon: Phone, t: "+39 351 719 9288", href: "tel:+393517199288" },
    { icon: Mail, t: "asautomarkouni@gmail.com", href: "mailto:asautomarkouni@gmail.com" },
    { icon: MapPin, t: "Portogruaro (VE)" },
    { icon: Clock, t: "Tutti i giorni, 9:00–20:00" },
  ];
  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Parliamone.</h1>
          <p className="mt-4 max-w-md text-muted-foreground">Hai visto un'auto che ti interessa o vuoi valutare una permuta? Scrivici o passa a trovarci.</p>
          <ul className="mt-10 space-y-5">
            {info.map((i) => (
              <li key={i.t} className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15"><i.icon className="h-5 w-5 text-primary" /></span>
                {i.href ? <a href={i.href} className="hover:text-primary">{i.t}</a> : i.t}
              </li>
            ))}
          </ul>
        </div>
        <div className="min-h-[400px] overflow-hidden rounded-2xl border">
          <iframe
            src="https://www.google.com/maps?q=Portogruaro,VE,Italia&output=embed"
            title="Mappa: Portogruaro (VE)"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[400px] w-full"
            style={{ border: 0 }}
          />
        </div>
      </section>
    </SiteLayout>
  );
}
