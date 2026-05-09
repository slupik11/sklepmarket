"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const Schema = z.object({
  name: z.string().min(2, "Podaj imię (min. 2 znaki)"),
  contact: z.string().min(5, "Podaj telefon lub email"),
  description: z.string().optional(),
});

export type SellerContactState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitSellerContact(
  prevState: SellerContactState,
  formData: FormData
): Promise<SellerContactState> {
  const raw = {
    name: formData.get("name"),
    contact: formData.get("contact"),
    description: formData.get("description"),
  };

  const parsed = Schema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: "Popraw błędy w formularzu",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, contact, description } = parsed.data;
  const isEmail = contact.includes("@");

  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("sell_requests") as any).insert({
    shop_name: "Kontakt wstępny",
    shop_url: "https://brak.pl",
    platform: "Nie podano",
    monthly_revenue: 0,
    asking_price: 0,
    description: description || "Brak opisu",
    seller_name: name,
    seller_email: isEmail ? contact : "telefon@kontakt.pl",
    seller_phone: isEmail ? "" : contact,
    status: "new",
  });

  if (error) {
    console.error("DB error:", error.message);
    return { error: "Wystąpił błąd zapisu. Spróbuj ponownie lub napisz do nas bezpośrednio." };
  }

  try {
    await sendNotificationEmails(name, contact, description || "");
  } catch (e) {
    console.error("Email error:", e);
    // Don't fail the form if email fails
  }

  return { success: true };
}

async function sendNotificationEmails(name: string, contact: string, description: string) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);

  // Notify admin
  await resend.emails.send({
    from: "SklepMarket.pl <noreply@sklepmarket.pl>",
    to: "kontakt@sklepmarket.pl",
    subject: `🔔 Nowe zgłoszenie sprzedaży — ${name}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #fff;">
        <div style="background: linear-gradient(135deg, #7C3AED, #6D28D9); border-radius: 10px; padding: 24px; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 1.5rem; font-weight: 800;">Nowe zgłoszenie sprzedaży</h1>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; color: #6B7280; font-size: 0.875rem; width: 140px;">Imię</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; color: #111827; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; color: #6B7280; font-size: 0.875rem;">Kontakt</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; color: #111827; font-weight: 600;">${contact}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6B7280; font-size: 0.875rem; vertical-align: top;">Opis sklepu</td>
            <td style="padding: 10px 0; color: #111827;">${description || "<em style='color:#9CA3AF'>Brak opisu</em>"}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding: 16px; background: #F5F3FF; border-radius: 8px; border-left: 3px solid #7C3AED;">
          <p style="margin: 0; font-size: 0.875rem; color: #6B7280;">⚡ Oddzwoń w ciągu 24 godzin</p>
        </div>
      </div>
    `,
  });

  // Confirm to seller if they gave email
  const isEmail = contact.includes("@");
  if (isEmail) {
    await resend.emails.send({
      from: "SklepMarket.pl <noreply@sklepmarket.pl>",
      to: contact,
      subject: "SklepMarket.pl — potwierdzenie zgłoszenia",
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <div style="background: linear-gradient(135deg, #12002E, #2D1B69); border-radius: 12px; padding: 28px; margin-bottom: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 1.4rem; font-weight: 900; letter-spacing: -0.03em;">
              Sklep<span style="color: #A78BFA;">Market</span>.pl
            </h1>
          </div>
          <h2 style="color: #111827; font-size: 1.25rem; font-weight: 800; margin-bottom: 12px;">
            Otrzymaliśmy Twoje zgłoszenie, ${name} 👋
          </h2>
          <p style="color: #6B7280; line-height: 1.7; margin-bottom: 20px;">
            Skontaktujemy się z Tobą w ciągu <strong style="color: #111827;">24 godzin roboczych</strong>.
            Wszystkie informacje pozostają <strong style="color: #111827;">poufne</strong> —
            przed rozmową o szczegółach podpisujemy wspólnie NDA.
          </p>
          <div style="background: #F5F3FF; border: 1px solid #EDE9FE; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 0.875rem; color: #7C3AED; font-weight: 600;">🔐 Twoje dane są bezpieczne</p>
            <p style="margin: 6px 0 0; font-size: 0.875rem; color: #6B7280;">
              Nie udostępniamy Twoich danych osobom trzecim. NDA podpisujemy razem przy pierwszym kontakcie.
            </p>
          </div>
          <p style="color: #9CA3AF; font-size: 0.8rem; margin-top: 24px; border-top: 1px solid #E5E7EB; padding-top: 16px;">
            SklepMarket.pl · kontakt@sklepmarket.pl
          </p>
        </div>
      `,
    });
  }
}
