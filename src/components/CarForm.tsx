import type { FormEvent, ReactNode } from "react";

const inputCls = "w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Fieldset({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-2xl border bg-card p-6">
      <legend className="-mt-9 mb-2 bg-background px-2 text-sm font-semibold">{title}</legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export type CarFormDefaults = Record<string, string | number | boolean | null | undefined>;

export function CarForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: {
  defaultValues?: CarFormDefaults;
  onSubmit: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const dv = defaultValues ?? {};
  const str = (key: string) => (dv[key] == null ? "" : String(dv[key]));
  const checked = (key: string) => Boolean(dv[key]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onSubmit(new FormData(e.currentTarget));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Fieldset title="Identificazione">
        <Field label="Marca">
          <input name="marca" required defaultValue={str("marca")} className={inputCls} />
        </Field>
        <Field label="Modello">
          <input name="modello" required defaultValue={str("modello")} className={inputCls} />
        </Field>
        <Field label="Versione / allestimento">
          <input name="versione" required defaultValue={str("versione")} className={inputCls} />
        </Field>
        <Field label="Anno immatricolazione">
          <input
            name="anno_immatricolazione"
            type="number"
            required
            defaultValue={str("anno_immatricolazione")}
            className={inputCls}
          />
        </Field>
        <Field label="Mese immatricolazione (1-12)">
          <input
            name="mese_immatricolazione"
            type="number"
            min={1}
            max={12}
            defaultValue={str("mese_immatricolazione")}
            className={inputCls}
          />
        </Field>
      </Fieldset>

      <Fieldset title="Motore / tecnica">
        <Field label="Carburante">
          <select name="carburante" defaultValue={str("carburante") || "Benzina"} className={inputCls}>
            {["Benzina", "Diesel", "Ibrida", "Elettrica", "GPL", "Metano"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Cambio">
          <select name="cambio" defaultValue={str("cambio") || "Manuale"} className={inputCls}>
            {["Manuale", "Automatico"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Cilindrata (cc)">
          <input name="cilindrata_cc" type="number" defaultValue={str("cilindrata_cc")} className={inputCls} />
        </Field>
        <Field label="Potenza (CV)">
          <input name="potenza_cv" type="number" required defaultValue={str("potenza_cv")} className={inputCls} />
        </Field>
        <Field label="Cilindri">
          <input name="cilindri" type="number" defaultValue={str("cilindri")} className={inputCls} />
        </Field>
        <Field label="Trazione">
          <input name="trazione" defaultValue={str("trazione")} className={inputCls} />
        </Field>
        <Field label="Classe emissioni">
          <input name="classe_emissioni" placeholder="Euro 6" defaultValue={str("classe_emissioni")} className={inputCls} />
        </Field>
      </Fieldset>

      <Fieldset title="Stato / storia">
        <Field label="Chilometri">
          <input name="km" type="number" required defaultValue={str("km")} className={inputCls} />
        </Field>
        <Field label="Numero proprietari">
          <input name="numero_proprietari" type="number" defaultValue={str("numero_proprietari")} className={inputCls} />
        </Field>
        <Field label="Scadenza revisione">
          <input name="scadenza_revisione" type="date" defaultValue={str("scadenza_revisione")} className={inputCls} />
        </Field>
        <Field label="Garanzia (mesi)">
          <input name="garanzia_mesi" type="number" defaultValue={str("garanzia_mesi")} className={inputCls} />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="tagliandi_certificati" defaultChecked={checked("tagliandi_certificati")} />
          Tagliandi certificati
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="incidentata" defaultChecked={checked("incidentata")} />
          Incidentata
        </label>
      </Fieldset>

      <Fieldset title="Commerciale">
        <Field label="Prezzo (€)">
          <input name="prezzo" type="number" required defaultValue={str("prezzo")} className={inputCls} />
        </Field>
        <Field label="Regime IVA">
          <select name="regime_iva" defaultValue={str("regime_iva") || "esposta"} className={inputCls}>
            <option value="esposta">IVA esposta</option>
            <option value="margine">Regime del margine</option>
          </select>
        </Field>
        <Field label="Stato annuncio">
          <select name="stato_annuncio" defaultValue={str("stato_annuncio") || "disponibile"} className={inputCls}>
            <option value="disponibile">Disponibile</option>
            <option value="riservata">Riservata</option>
            <option value="venduta">Venduta</option>
          </select>
        </Field>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="trattabile" defaultChecked={checked("trattabile")} />
            Trattabile
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="finanziabile" defaultChecked={checked("finanziabile")} />
            Finanziabile
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="permuta" defaultChecked={checked("permuta")} />
            Permuta accettata
          </label>
        </div>
      </Fieldset>

      <Fieldset title="Carrozzeria">
        <Field label="Carrozzeria">
          <input name="carrozzeria" required defaultValue={str("carrozzeria")} className={inputCls} />
        </Field>
        <Field label="Colore esterno">
          <input name="colore_esterno" required defaultValue={str("colore_esterno")} className={inputCls} />
        </Field>
        <Field label="Colore interno">
          <input name="colore_interno" defaultValue={str("colore_interno")} className={inputCls} />
        </Field>
        <Field label="Porte">
          <input name="porte" type="number" required defaultValue={str("porte")} className={inputCls} />
        </Field>
        <Field label="Posti">
          <input name="posti" type="number" defaultValue={str("posti")} className={inputCls} />
        </Field>
      </Fieldset>

      <Fieldset title="Testo libero">
        <div className="sm:col-span-2">
          <Field label="Descrizione">
            <textarea name="descrizione" rows={4} defaultValue={str("descrizione")} className={inputCls} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Optional (uno per riga)">
            <textarea name="optional" rows={4} defaultValue={str("optional")} className={inputCls} />
          </Field>
        </div>
      </Fieldset>

      <button className="w-full rounded-full bg-primary py-4 font-semibold text-primary-foreground shadow-glow hover:bg-primary/90">
        {submitLabel}
      </button>
    </form>
  );
}
