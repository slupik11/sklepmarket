"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogin(prevState: { error: string }, formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password !== adminPassword) {
    return { error: "Nieprawidłowe hasło" };
  }

  const cookieStore = cookies();
  cookieStore.set("admin_auth", adminPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
  });

  redirect("/admin");
}

export async function adminLogout() {
  const cookieStore = cookies();
  cookieStore.delete("admin_auth");
  redirect("/admin/login");
}
