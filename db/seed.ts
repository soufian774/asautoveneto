import { Pool } from "pg";

type SeedCar = {
  id: string;
  marca: string;
  modello: string;
  versione: string;
  anno: number;
  carburante: string;
  cambio: string;
  potenzaCv: number;
  trazione: string | null;
  km: number;
  prezzo: number;
  carrozzeria: string;
  colore: string;
  porte: number;
  descrizione: string;
  optional: string[];
  foto: string[];
};

const cars: SeedCar[] = [
  {
    id: "golf-8",
    marca: "Volkswagen",
    modello: "Golf",
    versione: "1.5 eTSI Life",
    anno: 2022,
    carburante: "Ibrida",
    cambio: "Automatico",
    potenzaCv: 150,
    trazione: null,
    km: 28500,
    prezzo: 22900,
    carrozzeria: "Berlina",
    colore: "Bianco",
    porte: 5,
    descrizione: "Unico proprietario, tagliandi certificati, perfette condizioni.",
    optional: ["Navigatore", "Cruise adattivo", "Sensori parcheggio", "Apple CarPlay"],
    foto: ["/images/car1.jpg"],
  },
  {
    id: "x3-xdrive",
    marca: "BMW",
    modello: "X3",
    versione: "xDrive20d M Sport",
    anno: 2021,
    carburante: "Diesel",
    cambio: "Automatico",
    potenzaCv: 190,
    trazione: "Integrale",
    km: 54000,
    prezzo: 41500,
    carrozzeria: "SUV",
    colore: "Blu",
    porte: 5,
    descrizione: "Pacchetto M Sport, interni in pelle, garanzia 12 mesi.",
    optional: ["Pelle", "Tetto panoramico", "Telecamera 360°", "Fari LED"],
    foto: ["/images/car2.jpg"],
  },
  {
    id: "giulia-veloce",
    marca: "Alfa Romeo",
    modello: "Giulia",
    versione: "2.0 Turbo Veloce Q4",
    anno: 2020,
    carburante: "Benzina",
    cambio: "Automatico",
    potenzaCv: 280,
    trazione: "Integrale",
    km: 41200,
    prezzo: 36800,
    carrozzeria: "Berlina",
    colore: "Rosso",
    porte: 4,
    descrizione: "Trazione integrale, impianto Harman Kardon, come nuova.",
    optional: ["Harman Kardon", "Sedili sportivi", "Palette al volante", "Cerchi 19\""],
    foto: ["/images/car3.jpg"],
  },
  {
    id: "polo",
    marca: "Volkswagen",
    modello: "Polo",
    versione: "1.0 TSI Style",
    anno: 2021,
    carburante: "Benzina",
    cambio: "Manuale",
    potenzaCv: 95,
    trazione: null,
    km: 35000,
    prezzo: 15900,
    carrozzeria: "Utilitaria",
    colore: "Bianco",
    porte: 5,
    descrizione: "Ideale neopatentati, consumi ridotti.",
    optional: ["Clima automatico", "Bluetooth", "Sensori parcheggio"],
    foto: ["/images/car1.jpg"],
  },
  {
    id: "q5",
    marca: "Audi",
    modello: "Q5",
    versione: "40 TDI quattro S line",
    anno: 2022,
    carburante: "Diesel",
    cambio: "Automatico",
    potenzaCv: 204,
    trazione: "Integrale",
    km: 32000,
    prezzo: 44900,
    carrozzeria: "SUV",
    colore: "Blu",
    porte: 5,
    descrizione: "Virtual cockpit, matrix LED, garanzia ufficiale.",
    optional: ["Virtual cockpit", "Matrix LED", "Portellone elettrico"],
    foto: ["/images/car2.jpg"],
  },
  {
    id: "tonale",
    marca: "Alfa Romeo",
    modello: "Tonale",
    versione: "1.5 Hybrid Ti",
    anno: 2023,
    carburante: "Ibrida",
    cambio: "Automatico",
    potenzaCv: 160,
    trazione: null,
    km: 12000,
    prezzo: 33500,
    carrozzeria: "SUV",
    colore: "Rosso",
    porte: 5,
    descrizione: "Km certificati, pari al nuovo.",
    optional: ["Navigatore", "Keyless", "Cruise adattivo"],
    foto: ["/images/car3.jpg"],
  },
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    for (const car of cars) {
      await pool.query(
        `INSERT INTO cars (
          id, marca, modello, versione, anno_immatricolazione,
          carburante, cambio, potenza_cv, trazione, classe_emissioni,
          km, numero_proprietari, tagliandi_certificati, incidentata, garanzia_mesi,
          prezzo, regime_iva, trattabile, finanziabile, permuta, stato_annuncio,
          carrozzeria, colore_esterno, porte,
          descrizione, optional
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21,
          $22, $23, $24,
          $25, $26
        )
        ON CONFLICT (id) DO NOTHING`,
        [
          car.id, car.marca, car.modello, car.versione, car.anno,
          car.carburante, car.cambio, car.potenzaCv, car.trazione, "Euro 6",
          car.km, 1, true, false, 12,
          car.prezzo, "esposta", true, true, true, "disponibile",
          car.carrozzeria, car.colore, car.porte,
          car.descrizione, car.optional.join("\n"),
        ],
      );

      for (const [i, url] of car.foto.entries()) {
        await pool.query(
          `INSERT INTO car_photos (car_id, url, ordine) VALUES ($1, $2, $3)
           ON CONFLICT (car_id, ordine) DO NOTHING`,
          [car.id, url, i],
        );
      }
    }

    console.log(`Seed completato: ${cars.length} auto inserite.`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
