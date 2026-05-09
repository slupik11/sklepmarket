import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export default function AdminPage() {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get("admin_auth")?.value === process.env.ADMIN_PASSWORD;

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}
