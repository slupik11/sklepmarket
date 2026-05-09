import AdminLoginForm from "./AdminLoginForm";
import { Store } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-section px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl violet-gradient-bg shadow-violet">
            <Store size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-ink">
            Sklep<span className="text-violet">Market</span><span className="text-ink-muted font-normal">.pl</span>
          </h1>
          <p className="mt-1 text-sm text-ink-muted">Panel administracyjny</p>
        </div>
        <div className="rounded-2xl border border-edge bg-white p-7 shadow-card-lg">
          <h2 className="mb-5 text-lg font-bold text-ink">Zaloguj się</h2>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
