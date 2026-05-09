# KupSklep.pl — Marketplace sklepów internetowych

Platforma do kupna i sprzedaży gotowych sklepów internetowych. Zbudowana na Next.js 14, Supabase i Tailwind CSS.

## Stack

- **Next.js 14** (App Router, Server Components)
- **Supabase** (PostgreSQL + Row Level Security)
- **Tailwind CSS** (custom dark theme)
- **Resend** (emaile transakcyjne)
- **Vercel** (deployment)

## Szybki start

### 1. Zainstaluj zależności

```bash
npm install
```

### 2. Utwórz projekt w Supabase

1. Idź na [supabase.com](https://supabase.com) i utwórz nowy projekt
2. Skopiuj **Project URL** i **anon key** z: Project Settings > API
3. Skopiuj **service_role key** (potrzebne do admin actions)

### 3. Skonfiguruj bazę danych

1. W Supabase Dashboard wejdź w **SQL Editor**
2. Wklej całą zawartość pliku `supabase/schema.sql`
3. Kliknij **Run** — tabele i seed data zostaną utworzone

### 4. Skonfiguruj zmienne środowiskowe

```bash
cp .env.example .env.local
```

Uzupełnij `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://twoj-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
ADMIN_PASSWORD=twoje-bezpieczne-haslo
```

### 5. Uruchom lokalnie

```bash
npm run dev
```

Otwórz http://localhost:3000

---

## Deployment na Vercel

1. Push repo na GitHub
2. Utwórz nowy projekt na vercel.com
3. Podepnij repo
4. W Environment Variables dodaj wszystkie zmienne z .env.example
5. Deploy

---

## Struktura projektu

```
kupsklep/
├── app/
│   ├── page.tsx                 Strona główna
│   ├── oferty/
│   │   ├── page.tsx             Lista ofert z filtrami
│   │   └── [slug]/page.tsx      Pojedyncza oferta
│   ├── sprzedaj/page.tsx        Formularz sprzedaży
│   ├── jak-to-dziala/page.tsx   Jak to działa + FAQ
│   ├── admin/                   Panel admina
│   └── actions/                 Server Actions (formularze, admin)
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ListingCard.tsx
│   ├── ListingFilters.tsx
│   ├── ContactForm.tsx
│   ├── SellForm.tsx
│   ├── Badge.tsx
│   └── MetricCard.tsx
├── lib/
│   ├── supabase/client.ts       Browser Supabase client
│   ├── supabase/server.ts       Server Supabase client
│   ├── supabase/types.ts        TypeScript typy
│   └── utils.ts                 formatPrice, formatRevenue, itp.
└── supabase/schema.sql          Schema SQL + 8 ofert seed
```

## Panel admina

Dostępny pod /admin. Hasło ustawiasz w ADMIN_PASSWORD (.env.local).

Funkcje:
- Zarządzanie ofertami (dodaj, zmień status, weryfikuj)
- Lista zapytań kupujących z oznaczaniem jako obsłużone
- Lista zgłoszeń sprzedaży ze zmianą statusu

## Emaile (Resend)

Emaile wysyłane do kontakt@kupsklep.pl przy:
- Nowym zapytaniu od kupującego (formularz na stronie oferty)
- Nowym zgłoszeniu sprzedaży

Bez klucza RESEND_API_KEY emaile są pomijane — aplikacja działa normalnie.
