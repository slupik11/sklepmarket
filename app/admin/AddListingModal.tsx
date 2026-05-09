"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createListing } from "@/app/actions/admin";
import { X, Loader2, CheckCircle } from "lucide-react";

const CATEGORIES = ["Ebooki", "Dropshipping", "Kosmetyki", "Kursy online", "Akcesoria do domu", "Moda", "Sport", "Inne"];
const PLATFORMS = ["Shopify", "WooCommerce", "PrestaShop", "Shoper", "IdoSell", "Inne"];

type ModalState = { error?: string; success?: boolean };

async function createListingAndClose(_prevState: ModalState, formData: FormData): Promise<ModalState> {
  try {
    await createListing(formData);
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Błąd zapisu" };
  }
}

const initialState: ModalState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-violet flex-1 justify-center disabled:opacity-60">
      {pending ? <><Loader2 size={16} className="animate-spin" /> Dodawanie...</> : "Dodaj ofertę"}
    </button>
  );
}

export default function AddListingModal({ onClose }: { onClose: () => void }) {
  const [state, action] = useFormState(createListingAndClose, initialState);

  if (state?.success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
        <div className="rounded-2xl border border-edge bg-white p-10 text-center max-w-sm w-full shadow-card-lg">
          <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-ink mb-2">Oferta dodana!</h3>
          <p className="text-sm text-ink-muted mb-6">Oferta została pomyślnie zapisana w bazie.</p>
          <button onClick={onClose} className="btn-violet w-full justify-center">
            Zamknij
          </button>
        </div>
      </div>
    );
  }

  const labelCls = "mb-1.5 block text-xs font-semibold text-ink-muted";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-edge bg-white p-6 shadow-card-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">Dodaj nową ofertę</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-bg-section hover:text-ink transition-colors">
            <X size={18} />
          </button>
        </div>

        <form action={action} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Tytuł *</label>
              <input name="title" required placeholder="Nazwa sklepu" />
            </div>
            <div>
              <label className={labelCls}>Kategoria *</label>
              <select name="category" required>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Platforma *</label>
              <select name="platform" required>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Cena (zł) *</label>
              <input name="asking_price" type="number" min="0" required placeholder="120000" />
            </div>
            <div>
              <label className={labelCls}>Przychód/mies. (zł) *</label>
              <input name="monthly_revenue" type="number" min="0" required placeholder="15000" />
            </div>
            <div>
              <label className={labelCls}>Wiek (mies.) *</label>
              <input name="age_months" type="number" min="1" required placeholder="24" />
            </div>
            <div>
              <label className={labelCls}>Email sprzedającego *</label>
              <input name="seller_email" type="email" required placeholder="sprzedajacy@example.com" />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select name="status">
                <option value="active">Aktywny</option>
                <option value="pending">Oczekujący</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Zweryfikowany</label>
              <select name="verified">
                <option value="false">Nie</option>
                <option value="true">Tak</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Opis *</label>
              <textarea name="description" rows={4} required placeholder="Opis sklepu..." className="resize-none" />
            </div>
          </div>

          {state?.error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
              <p className="text-sm text-red-600">{state.error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <SubmitButton />
            <button
              type="button"
              onClick={onClose}
              className="btn-outline-violet"
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
