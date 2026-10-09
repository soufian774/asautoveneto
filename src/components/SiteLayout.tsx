import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/auto", label: "Auto in vendita" },
  { to: "/contatti", label: "Contatti" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="font-display text-2xl font-extrabold tracking-tight">
      AS<span className="text-primary">AUTO</span>
    </Link>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
                {n.label}
              </Link>
            ))}
            <a href="tel:+393516600049" className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <Phone className="h-4 w-4" /> Chiamaci
            </a>
          </nav>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t px-4 py-4 md:hidden">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-medium hover:bg-accent">
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">Auto usate selezionate, garantite e pronte su strada.</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">Sede</p>
            <p>Portogruaro (VE)</p>
            <p>Tutti i giorni, 9:00–20:00</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">Contatti</p>
            <a href="tel:+393516600049" className="block hover:text-primary">+39 351 660 0049</a>
            <a href="tel:+393517199288" className="block hover:text-primary">+39 351 719 9288</a>
            <a href="mailto:asautomarkouni@gmail.com" className="block hover:text-primary">asautomarkouni@gmail.com</a>
          </div>
        </div>
        <p className="border-t py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} AS AUTO. Tutti i diritti riservati.</p>
      </footer>
    </div>
  );
}
