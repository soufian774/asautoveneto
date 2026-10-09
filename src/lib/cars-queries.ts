import { createServerFn } from "@tanstack/react-start";
import type { Car } from "@/data/cars";
import { pool } from "@/lib/db";

const CAR_SELECT = `
  SELECT
    id, marca, modello, versione, km, carburante, cambio, descrizione, optional,
    potenza_cv AS "potenzaCv",
    colore_esterno AS colore,
    carrozzeria, porte,
    anno_immatricolazione AS anno,
    ROUND(prezzo)::int AS prezzo,
    (SELECT url FROM car_photos p WHERE p.car_id = c.id ORDER BY ordine LIMIT 1) AS immagine,
    COALESCE((SELECT array_agg(url ORDER BY ordine) FROM car_photos p WHERE p.car_id = c.id), '{}') AS foto
  FROM cars c
`;

type CarRow = Omit<Car, "optional" | "immagine"> & { optional: string; immagine: string | null };

function mapRow(row: CarRow): Car {
  return {
    ...row,
    immagine: row.immagine ?? "",
    foto: row.foto ?? [],
    optional: row.optional
      .split("\n")
      .map((o) => o.trim())
      .filter(Boolean),
  };
}

export const fetchCars = createServerFn({ method: "GET" }).handler(async () => {
  const { rows } = await pool.query<CarRow>(
    `${CAR_SELECT} WHERE stato_annuncio = 'disponibile' ORDER BY anno_immatricolazione DESC`,
  );
  return rows.map(mapRow);
});

export const fetchCarById = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { rows } = await pool.query<CarRow>(
      `${CAR_SELECT} WHERE stato_annuncio = 'disponibile' AND id = $1`,
      [id],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  });
