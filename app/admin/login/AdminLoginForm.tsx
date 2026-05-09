"use client";

import { useFormState, useFormStatus } from "react-dom";
import { adminLogin } from "./actions";
import { Loader2 } from "lucide-react";

const initialState = { error: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-violet w-full justify-center disabled:opacity-60"
    >
      {pending ? <Loader2 size={18} className="animate-spin" /> : "Zaloguj się"}
    </button>
  );
}

export default function AdminLoginForm() {
  const [state, action] = useFormState(adminLogin, initialState);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Hasło</label>
        <input name="password" type="password" required placeholder="••••••••" autoFocus />
      </div>
      {state?.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}
      <SubmitButton />
    </form>
  );
}
