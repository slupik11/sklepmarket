"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitSellerContact, type SellerContactState } from "@/app/actions/seller-contact";
import { CheckCircle, Loader2, Lock, Phone } from "lucide-react";

const initialState: SellerContactState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-violet w-full justify-center py-3.5 text-[0.9375rem] disabled:opacity-60">
      {pending ? <><Loader2 size={18} className="animate-spin" />Wysyłanie...</> : "Wyślij zgłoszenie"}
    </button>
  );
}

export default function SellerContactForm() {
  const [state, action] = useFormState(submitSellerContact, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-violet/20 bg-violet-lighter p-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet/10">
          <CheckCircle size={36} className="text-violet" />
        </div>
        <h3 className="text-xl font-black text-ink tracking-tight">Zgłoszenie wysłane</h3>
        <p className="text-ink-muted max-w-xs leading-relaxed">
          Skontaktujemy się z Tobą w ciągu{" "}
          <strong className="text-ink">24 godzin roboczych</strong>.
          Wszystkie informacje są poufne.
        </p>
        <div className="flex items-center gap-2 text-xs text-ink-faint mt-1">
          <Lock size={11} />
          NDA podpisujemy przy pierwszym kontakcie
        </div>
      </div>
    );
  }

  const err = (field: string) => state.fieldErrors?.[field]?.[0];

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Imię <span className="text-violet">*</span>
        </label>
        <input
          name="name"
          type="text"
          placeholder="np. Marek"
          autoComplete="given-name"
          className={err("name") ? "border-red-400" : ""}
        />
        {err("name") && <p className="mt-1 text-xs text-red-500">{err("name")}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Telefon lub email <span className="text-violet">*</span>
        </label>
        <div className="relative">
          <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none" />
          <input
            name="contact"
            type="text"
            placeholder="+48 600 000 000 lub jan@firma.pl"
            autoComplete="tel email"
            className={`pl-9 ${err("contact") ? "border-red-400" : ""}`}
          />
        </div>
        {err("contact") && <p className="mt-1 text-xs text-red-500">{err("contact")}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Krótki opis sklepu{" "}
          <span className="text-ink-faint font-normal">(opcjonalnie)</span>
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="np. sklep z kosmetykami, ok. 20k/mies. przychodu, Shopify — lub nic nie pisz, możemy porozmawiać."
          className="resize-none"
        />
        <p className="mt-1 text-xs text-ink-faint">
          Nie musisz podawać nazwy sklepu — możesz pozostać anonimowy do podpisania NDA.
        </p>
      </div>

      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}

      <SubmitButton />

      <div className="flex items-center justify-center gap-2 text-xs text-ink-faint pt-1">
        <Lock size={11} className="text-violet" />
        Pełna poufność · NDA przy pierwszym kontakcie
      </div>
    </form>
  );
}
