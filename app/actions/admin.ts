"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateListingStatus(id: string, status: string) {
  const supabase = createClient();
  await (supabase.from("listings") as any).update({ status }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/oferty");
}

export async function toggleListingVerified(id: string, verified: boolean) {
  const supabase = createClient();
  await (supabase.from("listings") as any).update({ verified }).eq("id", id);
  revalidatePath("/admin");
}

export async function updateSellRequestStatus(id: string, status: string) {
  const supabase = createClient();
  await (supabase.from("sell_requests") as any).update({ status }).eq("id", id);
  revalidatePath("/admin");
}

export async function markInquiryHandled(id: string, handled: boolean) {
  const supabase = createClient();
  await (supabase.from("inquiries") as any).update({ handled }).eq("id", id);
  revalidatePath("/admin");
}

export async function createListing(formData: FormData) {
  const supabase = createClient();

  const slug =
    (formData.get("title") as string)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") +
    "-" +
    Date.now();

  const payload = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    platform: formData.get("platform") as string,
    monthly_revenue: Number(formData.get("monthly_revenue")),
    asking_price: Number(formData.get("asking_price")),
    age_months: Number(formData.get("age_months")),
    status: (formData.get("status") as string) || "active",
    verified: formData.get("verified") === "true",
    images: [] as string[],
    seller_email: formData.get("seller_email") as string,
    slug,
  };

  const { error } = await (supabase.from("listings") as any).insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/oferty");
}

export async function updateListing(id: string, formData: FormData) {
  const supabase = createClient();

  const payload = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    platform: formData.get("platform") as string,
    monthly_revenue: Number(formData.get("monthly_revenue")),
    asking_price: Number(formData.get("asking_price")),
    age_months: Number(formData.get("age_months")),
    status: formData.get("status") as string,
    verified: formData.get("verified") === "true",
    seller_email: formData.get("seller_email") as string,
  };

  const { error } = await (supabase.from("listings") as any).update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/oferty");
}
