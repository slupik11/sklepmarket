"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitSellRequest, type SellState } from "@/app/actions/sell";
import { CheckCircle, Loader2 } from "lucide-react";

const initialState: SellState = {};
const PLATFORMS = ["Shopify", "WooCommerce", "PrestaShop", "Shoper", "IdoSell", "Inne"];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-violet w-full justify-center text-base py-3.5 disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Wysyłanie...
        </>
      ) : (
        "Wyślij zgłoszenie"
      )}
    </button>
  );
}

export default function SellForm() {
  const [state, action] = useFormState(submitSellRequest, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-12 text-center">
        <CheckCircle size={56} className="text-emerald-500" />
        <h3 className="text-2xl font-bold text-ink">Zgłoszenie wysłane!</h3>
        <p className="max-w-sm text-ink-muted">
          Dziękujemy! Skontaktujemy się z Tobą w ciągu 24 godzin roboczych,
          aby omówić szczegóły i wycenę sklepu.
        </p>
      </div>
    );
  }

  const fieldError = (field: string) => state.fieldErrors?.[field]?.[0];

  const Field = ({
    name, label, type = "text", placeholder, required = false,
  }: {
    name: string; label: string; type?: string; placeholder?: string; required?: boolean;
  }) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label} {required && <span className="text-violet">*</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={fieldError(name) ? "border-red-400" : ""}
      />
      {fieldError(name) && (
        <p className="mt-1 text-xs text-red-500">{fieldError(name)}</p>
      )}
    </div>
  );

  return (
    <form action={action} className="space-y-6">
      {/* Shop section */}
      <div className="rounded-xl border border-edge bg-white p-6 shadow-card">
        <h3 className="mb-5 text-base font-bold text-ink">Dane sklepu</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field name="shop_name" label="Nazwa sklepu" placeholder="np. EkoKosmetyki.pl" required />
          </div>
          <div className="sm:col-span-2">
            <Field name="shop_url" label="Adres URL sklepu" type="url" placeholder="https://twojsklep.pl" required />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Platforma <span className="text-violet">*</span>
            </label>
            <select name="platform" required className={fieldError("platform") ? "border-red-400" : ""}>
              <option value="">Wybierz platformę</option>
              {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {fieldError("platform") && <p className="mt-1 text-xs text-red-500">{fieldError("platform")}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Miesięczny przychód (zł) <span className="text-violet">*</span>
            </label>
            <input
              name="monthly_revenue"
              type="number"
              min="0"
              placeholder="np. 25000"
              required
              className={fieldError("monthly_revenue") ? "border-red-400" : ""}
            />
            {fieldError("monthly_revenue") && <p className="mt-1 text-xs text-red-500">{fieldError("monthly_revenue")}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Oczekiwana cena sprzedaży (zł) <span className="text-violet">*</span>
            </label>
            <input
              name="asking_price"
              type="number"
              min="1000"
              placeholder="np. 120000"
              required
              className={fieldError("asking_price") ? "border-red-400" : ""}
            />
            {fieldError("asking_price") && <p className="mt-1 text-xs text-red-500">{fieldError("asking_price")}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Opis sklepu <span className="text-violet">*</span>
            </label>
            <textarea
              name="description"
              rows={5}
              required
              placeholder="Opisz swój sklep: co sprzedajesz, model biznesowy, dlaczego sprzedajesz, mocne strony..."
              className={`resize-none ${fieldError("description") ? "border-red-400" : ""}`}
            />
            {fieldError("description") && <p className="mt-1 text-xs text-red-500">{fieldError("description")}</p>}
            <p className="mt-1 text-xs text-ink-faint">Minimum 50 znaków</p>
          </div>
        </div>
      </div>

      {/* Contact section */}
      <div className="rounded-xl border border-edge bg-white p-6 shadow-card">
        <h3 className="mb-5 text-base font-bold text-ink">Dane kontaktowe</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field name="seller_name" label="Imię i nazwisko" placeholder="Jan Kowalski" required />
          </div>
          <Field name="seller_email" label="Adres email" type="email" placeholder="jan@example.com" required />
          <Field name="seller_phone" label="Numer telefonu" type="tel" placeholder="+48 600 000 000" required />
        </div>
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <SubmitButton />

      <p className="text-center text-xs text-ink-faint">
        Wystawienie jest bezpłatne. Odpowiadamy w ciągu 24 godzin.
      </p>
    </form>
  );
}
