"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitInquiry, type InquiryState } from "@/app/actions/inquiry";
import { CheckCircle, Loader2 } from "lucide-react";

const initialState: InquiryState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-violet w-full justify-center disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Wysyłanie...
        </>
      ) : (
        "Wyślij zapytanie"
      )}
    </button>
  );
}

export default function ContactForm({ listingId }: { listingId: string }) {
  const [state, action] = useFormState(submitInquiry, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle size={40} className="text-emerald-500" />
        <h3 className="text-lg font-semibold text-ink">Wiadomość wysłana!</h3>
        <p className="text-sm text-ink-muted">
          Skontaktujemy się z Tobą w ciągu 24 godzin.
        </p>
      </div>
    );
  }

  const fieldError = (field: string) => state.fieldErrors?.[field]?.[0];

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="listing_id" value={listingId} />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Imię i nazwisko <span className="text-violet">*</span>
        </label>
        <input
          name="buyer_name"
          type="text"
          placeholder="Jan Kowalski"
          required
          className={fieldError("buyer_name") ? "border-red-400" : ""}
        />
        {fieldError("buyer_name") && (
          <p className="mt-1 text-xs text-red-500">{fieldError("buyer_name")}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Adres email <span className="text-violet">*</span>
        </label>
        <input
          name="buyer_email"
          type="email"
          placeholder="jan@example.com"
          required
          className={fieldError("buyer_email") ? "border-red-400" : ""}
        />
        {fieldError("buyer_email") && (
          <p className="mt-1 text-xs text-red-500">{fieldError("buyer_email")}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Telefon <span className="text-violet">*</span>
        </label>
        <input
          name="buyer_phone"
          type="tel"
          placeholder="+48 600 000 000"
          required
          className={fieldError("buyer_phone") ? "border-red-400" : ""}
        />
        {fieldError("buyer_phone") && (
          <p className="mt-1 text-xs text-red-500">{fieldError("buyer_phone")}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Wiadomość <span className="text-violet">*</span>
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder="Jestem zainteresowany kupnem tego sklepu. Chciałbym dowiedzieć się więcej o..."
          required
          className={`resize-none ${fieldError("message") ? "border-red-400" : ""}`}
        />
        {fieldError("message") && (
          <p className="mt-1 text-xs text-red-500">{fieldError("message")}</p>
        )}
      </div>

      {state.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <SubmitButton />

      <p className="text-center text-xs text-ink-faint">
        Odpowiadamy w ciągu 24 godzin roboczych.
      </p>
    </form>
  );
}
