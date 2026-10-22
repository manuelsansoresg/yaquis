import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { AdminPanel } from "@/components/admin-panel";
export const metadata = { title: "Administración" };
export default async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin")
    return (
      <div className="container-shell page-content">
        <h1 className="text-3xl font-bold">Acceso restringido</h1>
        <p className="muted mt-3">
          Tu cuenta no tiene permisos de administrador.
        </p>
        <Link href="/" className="button-secondary mt-4">
          Volver al sitio
        </Link>
      </div>
    );
  return <AdminPanel user={user} />;
}
