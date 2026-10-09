-- id testuale (slug) invece di uuid: resta leggibile nell'URL /auto/$id
-- com'e' gia' oggi nei dati di esempio (es. "golf-8").
CREATE TABLE IF NOT EXISTS cars (
  id text PRIMARY KEY,

  -- Identificazione
  marca text NOT NULL,
  modello text NOT NULL,
  versione text NOT NULL,
  mese_immatricolazione integer CHECK (mese_immatricolazione BETWEEN 1 AND 12),
  anno_immatricolazione integer NOT NULL,

  -- Motore / tecnica
  carburante text NOT NULL,
  cambio text NOT NULL,
  cilindrata_cc integer,
  potenza_cv integer NOT NULL,
  cilindri integer,
  trazione text,
  classe_emissioni text,

  -- Stato / storia
  km integer NOT NULL,
  numero_proprietari integer,
  tagliandi_certificati boolean NOT NULL DEFAULT false,
  incidentata boolean NOT NULL DEFAULT false,
  scadenza_revisione date,
  garanzia_mesi integer,

  -- Commerciale
  prezzo numeric(10, 2) NOT NULL,
  regime_iva text NOT NULL DEFAULT 'esposta' CHECK (regime_iva IN ('esposta', 'margine')),
  trattabile boolean NOT NULL DEFAULT false,
  finanziabile boolean NOT NULL DEFAULT false,
  permuta boolean NOT NULL DEFAULT false,
  stato_annuncio text NOT NULL DEFAULT 'disponibile'
    CHECK (stato_annuncio IN ('disponibile', 'riservata', 'venduta')),

  -- Carrozzeria
  carrozzeria text NOT NULL,
  colore_esterno text NOT NULL,
  colore_interno text,
  porte integer NOT NULL,
  posti integer,

  -- Testo libero
  descrizione text NOT NULL DEFAULT '',
  optional text NOT NULL DEFAULT '',

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS car_photos (
  id serial PRIMARY KEY,
  car_id text NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  url text NOT NULL,
  ordine integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (car_id, ordine)
);

CREATE INDEX IF NOT EXISTS cars_marca_idx ON cars(marca);
CREATE INDEX IF NOT EXISTS cars_stato_annuncio_idx ON cars(stato_annuncio);
CREATE INDEX IF NOT EXISTS car_photos_car_id_idx ON car_photos(car_id, ordine);
