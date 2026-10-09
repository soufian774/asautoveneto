import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { CarForm } from "@/components/CarForm";
import { createCar } from "@/lib/admin-cars";

export const Route = createFileRoute("/admin/nuova")({
  head: () => ({ meta: [{ title: "Nuova auto — Area Admin" }, { name: "robots", content: "noindex" }] }),
  component: NuovaAuto,
});

function NuovaAuto() {
  const navigate = useNavigate();

  async function handleSubmit(formData: FormData) {
    const { id } = await createCar({ data: formData });
    navigate({ to: "/admin/$id", params: { id } });
  }

  return (
    <AdminLayout>
      <h1 className="mb-6 text-2xl font-bold">Nuova auto</h1>
      <CarForm onSubmit={handleSubmit} submitLabel="Crea auto" />
    </AdminLayout>
  );
}
