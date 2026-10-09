import { Link } from "@tanstack/react-router";
import { Calendar, Fuel, Gauge, Settings2 } from "lucide-react";
import { type Car, formatKm, formatPrice } from "@/data/cars";

export function CarCard({ car }: { car: Car }) {
  return (
    <Link
      to="/auto/$id"
      params={{ id: car.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <img src={car.immagine} alt={`${car.marca} ${car.modello}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold backdrop-blur">{car.carrozzeria}</span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{car.marca}</p>
          <h3 className="truncate text-xl font-bold">{car.modello} <span className="font-normal text-muted-foreground">{car.versione}</span></h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><Calendar className="h-4 w-4 shrink-0 text-primary" />{car.anno}</span>
          <span className="flex items-center gap-2"><Gauge className="h-4 w-4 shrink-0 text-primary" />{formatKm(car.km)}</span>
          <span className="flex items-center gap-2"><Fuel className="h-4 w-4 shrink-0 text-primary" />{car.carburante}</span>
          <span className="flex items-center gap-2"><Settings2 className="h-4 w-4 shrink-0 text-primary" />{car.cambio}</span>
        </div>
        <div className="mt-auto flex items-end justify-between border-t pt-4">
          <span className="font-display text-2xl font-bold">{formatPrice(car.prezzo)}</span>
          <span className="text-sm font-semibold text-primary">Dettagli →</span>
        </div>
      </div>
    </Link>
  );
}
