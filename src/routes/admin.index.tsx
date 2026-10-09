import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { formatPrice } from "@/data/cars";
import { deleteCar, fetchAllCarsAdmin } from "@/lib/admin-cars";

export const Route = createFileRoute("/admin/")({
  loader: () => fetchAllCarsAdmin(),
  head: () => ({ meta: [{ title: "Gestione auto — Area Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminCarsList,
});

const statoLabel: Record<string, string> = {
  disponibile: "Disponibile",
  riservata: "Riservata",
  venduta: "Venduta",
};

function AdminCarsList() {
  const cars = Route.useLoaderData();
  const router = useRouter();

  async function handleDelete(id: string, label: string) {
    if (!confirm(`Eliminare "${label}"? L'operazione non è reversibile.`)) return;
    await deleteCar({ data: id });
    router.invalidate();
  }

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Auto in gestione ({cars.length})</h1>
        <Link
          to="/admin/nuova"
          className="flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Nuova auto
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-card text-left text-muted-foreground">
            <tr>
              <th className="p-4">Auto</th>
              <th className="p-4">Anno</th>
              <th className="p-4">Prezzo</th>
              <th className="p-4">Stato</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {cars.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-4">
                  <Link to="/admin/$id" params={{ id: c.id }} className="font-semibold hover:text-primary">
                    {c.marca} {c.modello}
                  </Link>
                  <p className="text-muted-foreground">{c.versione}</p>
                </td>
                <td className="p-4">{c.anno}</td>
                <td className="p-4">{formatPrice(c.prezzo)}</td>
                <td className="p-4">{statoLabel[c.statoAnnuncio] ?? c.statoAnnuncio}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(c.id, `${c.marca} ${c.modello}`)}
                    className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Elimina"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {cars.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  Nessuna auto in gestione.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
