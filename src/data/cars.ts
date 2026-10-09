export type Car = {
  id: string;
  marca: string;
  modello: string;
  versione: string;
  prezzo: number;
  anno: number;
  km: number;
  carburante: "Benzina" | "Diesel" | "Ibrida" | "Elettrica" | "GPL" | "Metano";
  cambio: "Manuale" | "Automatico";
  potenzaCv: number;
  colore: string;
  carrozzeria: string;
  porte: number;
  immagine: string;
  foto: string[];
  descrizione: string;
  optional: string[];
};

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
export const formatKm = (n: number) => new Intl.NumberFormat("it-IT").format(n) + " km";
