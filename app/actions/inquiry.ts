"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const InquirySchema = z.object({
  listing_id: z.string().uuid(),
  buyer_name: z.string().min(2, "Imię i nazwisko jest wymagane"),
  buyer_email: z.string().email("Nieprawidłowy adres email"),
  buyer_phone: z.string().min(9, "Nieprawidłowy numer telefonu"),
  message: z.string().min(10, "Wiadomość musi mieć co najmniej 10 znaków"),
});

export type InquiryState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitInquiry(
  prevState: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const raw = {
    listing_id: formData.get("listing_id"),
    buyer_name: formData.get("buyer_name"),
    buyer_email: formData.get("buyer_email"),
    buyer_phone: formData.get("buyer_phone"),
    message: formData.get("message"),
  };

  const parsed = InquirySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: "Popraw błędy w formularzu",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();
  const { error } = await supabase.from("inquiries").insert(parsed.data);

  if (error) {
    return { error: "Wystąpił błąd. Spróbuj ponownie." };
  }

  // Send email notification (fire and forget)
  try {
    await sendInquiryEmail(parsed.data);
  } catch {}

  return { success: true };
}

async function sendInquiryEmail(data: z.infer<typeof InquirySchema>) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);

  await resend.emails.send({
    from: "SklepMarket.pl <noreply@sklepmarket.pl>",
    to: "kontakt@sklepmarket.pl",
    subject: `Nowe zapytanie od ${data.buyer_name}`,
    html: `
      <h2>Nowe zapytanie o sklep</h2>
      <p><strong>Imię i nazwisko:</strong> ${data.buyer_name}</p>
      <p><strong>Email:</strong> ${data.buyer_email}</p>
      <p><strong>Telefon:</strong> ${data.buyer_phone}</p>
      <p><strong>Wiadomość:</strong></p>
      <p>${data.message}</p>
      <hr/>
      <p><small>Listing ID: ${data.listing_id}</small></p>
    `,
  });
}
