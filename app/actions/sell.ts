"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const SellSchema = z.object({
  shop_name: z.string().min(2, "Nazwa sklepu jest wymagana"),
  shop_url: z.string().url("Nieprawidłowy adres URL sklepu"),
  platform: z.string().min(1, "Wybierz platformę"),
  monthly_revenue: z.coerce.number().min(0, "Podaj miesięczny przychód"),
  asking_price: z.coerce.number().min(1000, "Cena musi wynosić co najmniej 1 000 zł"),
  description: z.string().min(50, "Opis musi mieć co najmniej 50 znaków"),
  seller_name: z.string().min(2, "Imię i nazwisko jest wymagane"),
  seller_email: z.string().email("Nieprawidłowy adres email"),
  seller_phone: z.string().min(9, "Nieprawidłowy numer telefonu"),
});

export type SellState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitSellRequest(
  prevState: SellState,
  formData: FormData
): Promise<SellState> {
  const raw = {
    shop_name: formData.get("shop_name"),
    shop_url: formData.get("shop_url"),
    platform: formData.get("platform"),
    monthly_revenue: formData.get("monthly_revenue"),
    asking_price: formData.get("asking_price"),
    description: formData.get("description"),
    seller_name: formData.get("seller_name"),
    seller_email: formData.get("seller_email"),
    seller_phone: formData.get("seller_phone"),
  };

  const parsed = SellSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: "Popraw błędy w formularzu",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();
  const { error } = await supabase.from("sell_requests").insert({
    ...parsed.data,
    status: "new",
  });

  if (error) {
    return { error: "Wystąpił błąd. Spróbuj ponownie." };
  }

  try {
    await sendSellEmail(parsed.data);
  } catch {}

  return { success: true };
}

async function sendSellEmail(data: z.infer<typeof SellSchema>) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);

  await resend.emails.send({
    from: "SklepMarket.pl <noreply@sklepmarket.pl>",
    to: "kontakt@sklepmarket.pl",
    subject: `Nowe zgłoszenie sprzedaży: ${data.shop_name}`,
    html: `
      <h2>Nowe zgłoszenie sprzedaży sklepu</h2>
      <h3>Dane sklepu</h3>
      <p><strong>Nazwa:</strong> ${data.shop_name}</p>
      <p><strong>URL:</strong> ${data.shop_url}</p>
      <p><strong>Platforma:</strong> ${data.platform}</p>
      <p><strong>Miesięczny przychód:</strong> ${data.monthly_revenue} zł</p>
      <p><strong>Oczekiwana cena:</strong> ${data.asking_price} zł</p>
      <p><strong>Opis:</strong> ${data.description}</p>
      <h3>Dane sprzedającego</h3>
      <p><strong>Imię i nazwisko:</strong> ${data.seller_name}</p>
      <p><strong>Email:</strong> ${data.seller_email}</p>
      <p><strong>Telefon:</strong> ${data.seller_phone}</p>
    `,
  });
}
