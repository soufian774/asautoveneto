import { randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { createServerFn } from "@tanstack/react-start";
import { pool } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

const CAR_FIELDS = [
  "marca", "modello", "versione",
  "mese_immatricolazione", "anno_immatricolazione",
  "carburante", "cambio", "cilindrata_cc", "potenza_cv", "cilindri", "trazione", "classe_emissioni",
  "km", "numero_proprietari", "tagliandi_certificati", "incidentata", "scadenza_revisione", "garanzia_mesi",
  "prezzo", "regime_iva", "trattabile", "finanziabile", "permuta", "stato_annuncio",
  "carrozzeria", "colore_esterno", "colore_interno", "porte", "posti",
  "descrizione", "optional",
] as const;

const BOOL_FIELDS = new Set(["tagliandi_certificati", "incidentata", "trattabile", "finanziabile", "permuta"]);
const INT_FIELDS = new Set([
  "mese_immatricolazione", "anno_immatricolazione", "cilindrata_cc", "potenza_cv", "cilindri",
  "km", "numero_proprietari", "garanzia_mesi", "porte", "posti",
]);
const NULLABLE_FIELDS = new Set([
  "mese_immatricolazione", "cilindrata_cc", "cilindri", "trazione", "classe_emissioni",
  "numero_proprietari", "scadenza_revisione", "garanzia_mesi", "colore_interno", "posti",
]);

function parseCarForm(fd: FormData) {
  return CAR_FIELDS.map((field) => {
    if (BOOL_FIELDS.has(field)) return fd.get(field) !== null;
    const raw = (fd.get(field) as string | null)?.trim() ?? "";
    if (raw === "" && NULLABLE_FIELDS.has(field)) return null;
    if (field === "prezzo") return Number.parseFloat(raw) || 0;
    if (INT_FIELDS.has(field)) return raw === "" ? null : Number.parseInt(raw, 10);
    return raw;
  });
}

function stripDiacritics(value: string) {
  return Array.from(value.normalize("NFD"))
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      return code < 0x0300 || code > 0x036f;
    })
    .join("");
}

function generateCarId(marca: string, modello: string) {
  const base = stripDiacritics(`${marca}-${modello}`.toLowerCase())
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "auto"}-${randomBytes(3).toString("hex")}`;
}

// In produzione va impostata a una cartella FUORI dalla cartella dell'app
// (es. /var/www/asauto-uploads/cars), cosi' le foto non vengono toccate
// da un nuovo deploy/build del sito. Di default, in sviluppo, resta
// dentro public/ cosi' Vite le serve senza configurazione aggiuntiva.
function uploadsDir() {
  return process.env["UPLOADS_DIR"] || path.join(process.cwd(), "public", "images", "cars");
}

function photoPhysicalPath(url: string) {
  const relative = url.replace(/^\/images\/cars\//, "");
  return path.join(uploadsDir(), relative);
}

async function deletePhotoFile(url: string) {
  try {
    await unlink(photoPhysicalPath(url));
  } catch {
    // il file potrebbe essere gia' assente, non e' un problema
  }
}

export type AdminCarListItem = {
  id: string;
  marca: string;
  modello: string;
  versione: string;
  prezzo: number;
  anno: number;
  statoAnnuncio: string;
};

export const fetchAllCarsAdmin = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { rows } = await pool.query<AdminCarListItem>(`
    SELECT id, marca, modello, versione, ROUND(prezzo)::int AS prezzo,
           anno_immatricolazione AS anno, stato_annuncio AS "statoAnnuncio"
    FROM cars ORDER BY created_at DESC
  `);
  return rows;
});

export const fetchCarByIdAdmin = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await requireAdmin();
    const { rows } = await pool.query(
      `SELECT
        id, marca, modello, versione,
        mese_immatricolazione, anno_immatricolazione,
        carburante, cambio, cilindrata_cc, potenza_cv, cilindri, trazione, classe_emissioni,
        km, numero_proprietari, tagliandi_certificati, incidentata,
        scadenza_revisione::text AS scadenza_revisione, garanzia_mesi,
        prezzo, regime_iva, trattabile, finanziabile, permuta, stato_annuncio,
        carrozzeria, colore_esterno, colore_interno, porte, posti,
        descrizione, optional
      FROM cars WHERE id = $1`,
      [id],
    );
    const car = rows[0];
    if (!car) return null;
    const { rows: photos } = await pool.query(
      "SELECT id, url, ordine FROM car_photos WHERE car_id = $1 ORDER BY ordine",
      [id],
    );
    return { car, photos };
  });

export const createCar = createServerFn({ method: "POST" })
  .validator((data: FormData) => data)
  .handler(async ({ data: fd }) => {
    await requireAdmin();
    const values = parseCarForm(fd);
    const id = generateCarId(String(values[0]), String(values[1]));
    const placeholders = CAR_FIELDS.map((_, i) => `$${i + 2}`).join(", ");
    await pool.query(
      `INSERT INTO cars (id, ${CAR_FIELDS.join(", ")}) VALUES ($1, ${placeholders})`,
      [id, ...values],
    );
    return { id };
  });

export const updateCar = createServerFn({ method: "POST" })
  .validator((data: FormData) => data)
  .handler(async ({ data: formData }) => {
    await requireAdmin();
    const id = formData.get("id") as string;
    const values = parseCarForm(formData);
    const setClause = CAR_FIELDS.map((field, i) => `${field} = $${i + 2}`).join(", ");
    await pool.query(
      `UPDATE cars SET ${setClause}, updated_at = now() WHERE id = $1`,
      [id, ...values],
    );
  });

export const deleteCar = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await requireAdmin();
    const { rows } = await pool.query<{ url: string }>("SELECT url FROM car_photos WHERE car_id = $1", [id]);
    await pool.query("DELETE FROM cars WHERE id = $1", [id]);
    await Promise.all(rows.map((r) => deletePhotoFile(r.url)));
  });

export const uploadCarPhoto = createServerFn({ method: "POST" })
  .validator((data: FormData) => data)
  .handler(async ({ data: fd }) => {
    await requireAdmin();
    const carId = fd.get("carId") as string;
    const files = fd.getAll("foto").filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length === 0) return { uploaded: 0 };

    const { rows } = await pool.query<{ max: number | null }>(
      "SELECT MAX(ordine) AS max FROM car_photos WHERE car_id = $1",
      [carId],
    );
    let ordine = (rows[0]?.max ?? -1) + 1;

    const dir = path.join(uploadsDir(), carId);
    await mkdir(dir, { recursive: true });

    let uploaded = 0;
    for (const file of files) {
      if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) continue;
      const ext = path.extname(file.name);
      const safeExt = /^\.[a-zA-Z0-9]+$/.test(ext) ? ext : ".jpg";
      const filename = `${Date.now()}-${randomBytes(4).toString("hex")}${safeExt}`;
      await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
      const url = `/images/cars/${carId}/${filename}`;
      await pool.query("INSERT INTO car_photos (car_id, url, ordine) VALUES ($1, $2, $3)", [carId, url, ordine]);
      ordine += 1;
      uploaded += 1;
    }
    return { uploaded };
  });

export const deleteCarPhoto = createServerFn({ method: "POST" })
  .validator((photoId: number) => photoId)
  .handler(async ({ data: photoId }) => {
    await requireAdmin();
    const { rows } = await pool.query<{ url: string }>(
      "DELETE FROM car_photos WHERE id = $1 RETURNING url",
      [photoId],
    );
    if (rows[0]) await deletePhotoFile(rows[0].url);
  });
