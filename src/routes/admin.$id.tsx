import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Trash2, Upload } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { CarForm } from "@/components/CarForm";
import { deleteCar, deleteCarPhoto, fetchCarByIdAdmin, updateCar, uploadCarPhoto } from "@/lib/admin-cars";

export const Route = createFileRoute("/admin/$id")({
  loader: async ({ params }) => {
    const result = await fetchCarByIdAdmin({ data: params.id });
    if (!result) throw notFound();
    return result;
  },
  head: () => ({ meta: [{ title: "Modifica auto — Area Admin" }, { name: "robots", content: "noindex" }] }),
  notFoundComponent: () => (
    <AdminLayout>
      <p>Auto non trovata. <Link to="/admin" className="text-primary">Torna alla lista</Link></p>
    </AdminLayout>
  ),
  component: EditAuto,
});

function EditAuto() {
  const { car, photos } = Route.useLoaderData();
  const { id } = Route.useParams();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(formData: FormData) {
    setSaved(false);
    formData.set("id", id);
    await updateCar({ data: formData });
    setSaved(true);
    router.invalidate();
  }

  async function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("carId", id);
    await uploadCarPhoto({ data: fd });
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.invalidate();
  }

  async function handleDeletePhoto(photoId: number) {
    await deleteCarPhoto({ data: photoId });
    router.invalidate();
  }

  async function handleDeleteCar() {
    if (!confirm(`Eliminare "${car.marca} ${car.modello}"? L'operazione non è reversibile.`)) return;
    await deleteCar({ data: id });
    await router.navigate({ to: "/admin" });
  }

  return (
    <AdminLayout>
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Tutte le auto
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">
          {car.marca} {car.modello}
        </h1>
        <button
          onClick={handleDeleteCar}
          className="flex shrink-0 items-center gap-2 rounded-full border border-destructive/30 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" /> Elimina auto
        </button>
      </div>

      <section className="mt-6 rounded-2xl border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold">Foto</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((p) => (
            <div key={p.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl border">
              <img src={p.url} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => handleDeletePhoto(p.id)}
                className="absolute right-2 top-2 rounded-full bg-background/90 p-1.5 text-destructive opacity-0 transition group-hover:opacity-100"
                aria-label="Elimina foto"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {photos.length === 0 && <p className="col-span-full text-sm text-muted-foreground">Nessuna foto caricata.</p>}
        </div>

        <form onSubmit={handleUpload} className="mt-4 flex flex-wrap items-center gap-3">
          <input ref={fileInputRef} type="file" name="foto" accept="image/*" multiple required />
          <button className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Upload className="h-4 w-4" /> Carica foto
          </button>
        </form>
      </section>

      <div className="mt-6">
        {saved && <p className="mb-4 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">Modifiche salvate.</p>}
        <CarForm defaultValues={car} onSubmit={handleSubmit} submitLabel="Salva modifiche" />
      </div>
    </AdminLayout>
  );
}
