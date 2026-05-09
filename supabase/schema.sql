-- KupSklep.pl — Supabase Schema
-- Wklej ten plik w SQL Editor w Supabase Dashboard

-- ============================
-- TABELE
-- ============================

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null,
  platform text not null,
  monthly_revenue integer not null default 0,
  asking_price integer not null,
  age_months integer not null default 1,
  status text not null default 'active' check (status in ('active', 'pending', 'sold')),
  verified boolean not null default false,
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  seller_email text not null,
  slug text not null unique
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text not null,
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists sell_requests (
  id uuid primary key default gen_random_uuid(),
  shop_name text not null,
  shop_url text not null,
  platform text not null,
  monthly_revenue integer not null default 0,
  asking_price integer not null,
  description text not null,
  seller_name text not null,
  seller_email text not null,
  seller_phone text not null,
  status text not null default 'new' check (status in ('new', 'reviewing', 'listed', 'rejected')),
  created_at timestamptz not null default now()
);

-- ============================
-- INDEKSY
-- ============================

create index if not exists listings_status_idx on listings(status);
create index if not exists listings_category_idx on listings(category);
create index if not exists listings_platform_idx on listings(platform);
create index if not exists listings_slug_idx on listings(slug);
create index if not exists inquiries_listing_id_idx on inquiries(listing_id);

-- ============================
-- ROW LEVEL SECURITY
-- ============================

alter table listings enable row level security;
alter table inquiries enable row level security;
alter table sell_requests enable row level security;

-- Public: anyone can read active listings
create policy "Public can read active listings"
  on listings for select
  using (status = 'active');

-- Service role can do everything (used by server actions with service key)
-- For anon key usage (admin), we allow all with anon key using policies below:

create policy "Anon can insert inquiries"
  on inquiries for insert
  with check (true);

create policy "Anon can insert sell_requests"
  on sell_requests for insert
  with check (true);

-- Admin (service role) full access
create policy "Service role full access listings"
  on listings for all
  using (true)
  with check (true);

create policy "Service role full access inquiries"
  on inquiries for all
  using (true)
  with check (true);

create policy "Service role full access sell_requests"
  on sell_requests for all
  using (true)
  with check (true);

-- ============================
-- SEED DATA — 8 przykładowych ofert
-- ============================

insert into listings (title, description, category, platform, monthly_revenue, asking_price, age_months, status, verified, images, seller_email, slug) values

-- 1. Ebooki Shopify
(
  'EduBook.pl — sklep z ebookami biznesowymi',
  'Sklep internetowy specjalizujący się w sprzedaży ebooków z zakresu biznesu, marketingu i personal finance. Działa od ponad 2 lat na platformie Shopify.

Mocne strony:
- Biblioteka 120+ tytułów, w tym 15 bestsellerów generujących 60% przychodu
- Organiczny ruch z SEO (35% wszystkich wizyt)
- Newsletter 8 400 subskrybentów, CTR 6,2%
- Zautomatyzowana dostawa cyfrowa
- Niskie koszty operacyjne (~1 200 zł/mies.)

Przychód regularny od 18 miesięcy. Sklep nie wymaga dużego zaangażowania czasowego — 5-8h tygodniowo.',
  'Ebooki', 'Shopify', 7200, 72000, 26, 'active', true, '{}', 'sprzedajacy@example.com', 'edubook-pl-ebooki-biznesowe'
),

-- 2. Ebooki Shopify
(
  'Zdrowe Przepisy — ebooki kulinarne i plany żywieniowe',
  'Sklep na Shopify ze specjalistycznymi ebookami dietetycznymi i planami żywieniowymi. Nisza zdrowotna z bardzo lojalnymi klientami i wysokim LTV.

Co oferuje sklep:
- 45 produktów cyfrowych (ebooki, meal plany, shopping listy)
- 14 200 klientów w bazie, średni klient kupuje 2,3 razy
- Instagram 28k obserwujących powiązany ze sklepem
- Autorskie przepisy — nie ma konkurencji 1:1
- Współpraca z 3 dietetykami-influencerami

Sprzedaż stabilna od 3 lat. Właściciel sprzedaje z powodu zmiany branży.',
  'Ebooki', 'Shopify', 13500, 135000, 38, 'active', true, '{}', 'sprzedajacy2@example.com', 'zdrowe-przepisy-ebooki-kulinarne'
),

-- 3. Dropshipping
(
  'TechGadget.pl — elektronika i gadżety dropshipping',
  'Sklep dropshippingowy z elektroniką użytkową i gadżetami. Działamy na WooCommerce z integracją dostawców z Europy (brak ceł, szybka dostawa).

Dane operacyjne:
- 850 produktów aktywnych w katalogu
- 3 sprawdzonych dostawców z UE (DE, CZ, PL)
- Google Shopping: ROAS 4,2x przez ostatnie 6 miesięcy
- Średnia wartość zamówienia: 189 zł
- Konwersja 3,1% (powyżej średniej branży)
- Team: 1 osoba (3-4h/dzień)

Sklep działa pełni automatycznie — zamówienia, faktury, fulfillment są zautomatyzowane.',
  'Dropshipping', 'WooCommerce', 22000, 165000, 31, 'active', true, '{}', 'sprzedajacy3@example.com', 'techgadget-pl-elektronika-dropshipping'
),

-- 4. Dropshipping
(
  'DomStylu.pl — dekoracje i meble dropshipping premium',
  'Sklep dropshippingowy w premium segmencie wyposażenia wnętrz. Skupiamy się na klientach szukających jakości — wyższy AOV, niższy CAC.

Kluczowe metryki:
- Średni koszyk: 420 zł
- Marża brutto: 38%
- Meta Ads ROAS: 5,1x (sprawdzone przez 12 miesięcy)
- Organiczne klientki z Instagrama i Pinteresta
- 2 200 recenzji, 4,8/5.0 średnia
- Stała współpraca z 5 dostawcami z Niemiec i Danii

Właściciel sprzedaje, bo otwiera markę własną.',
  'Dropshipping', 'Shopify', 31000, 248000, 44, 'active', false, '{}', 'sprzedajacy4@example.com', 'domstylu-pl-dekoracje-dropshipping'
),

-- 5. Kosmetyki
(
  'Naturalis — organiczne kosmetyki własnej marki',
  'Sklep z własną linią organicznych kosmetyków do pielęgnacji twarzy i ciała. Wszystkie produkty certyfikowane COSMOS ORGANIC, produkowane w polskim laboratorium.

Wyróżniki:
- 8 własnych produktów (kremy, serum, olejki)
- 100% powtarzalnych zamówień: 42% klientek wraca co miesiąc
- Własny kanał YouTube 12k sub z tutorialami pielęgnacyjnymi
- Sklep WooCommerce + hurtownia B2B (drogerie, apteki)
- Patenty na 2 formuły
- Marża netto: 52%

Świetna nisza, bardzo trudna do replikacji. Sprzedaż z powodów osobistych.',
  'Kosmetyki', 'WooCommerce', 28000, 280000, 52, 'active', true, '{}', 'sprzedajacy5@example.com', 'naturalis-organiczne-kosmetyki'
),

-- 6. Kosmetyki
(
  'GlowUp Store — kosmetyki koreańskie i azjatyckie',
  'Jedyny w Polsce tak duży sklep specjalizujący się wyłącznie w kosmetykach koreańskich i japońskich. Ogromna baza lojalnych klientek.

Liczby:
- 1 800 SKU od 65 marek
- Newsletter 22 000 subskrybentów (OR 31%)
- TikTok 45k obserwujących — główne źródło nowych klientek
- Autorski blog z recenzjami: 80k UU miesięcznie
- Umowy z 4 oficjalnymi dystrybutorami na Polskę
- Zysk operacyjny: 18 500 zł/mies.

Właścicielka emigruje — szuka kupca z pasją do beauty.',
  'Kosmetyki', 'Shoper', 54000, 486000, 67, 'active', true, '{}', 'sprzedajacy6@example.com', 'glowup-store-kosmetyki-koreanskie'
),

-- 7. Kursy online
(
  'DevMaster — kursy programowania dla początkujących',
  'Platforma e-learningowa z kursami programowania. Skupiamy się na kompletnych beginner-friendly ścieżkach (JavaScript, Python, SQL).

Model biznesowy:
- 6 kursów głównych (jednorazowy zakup) + 1 subskrypcja premium
- 3 400 aktywnych uczniów
- Certyfikaty po ukończeniu (przydatne w CV)
- Afiliacja z 80 partnerami (głównie edukacyjne blogi i YouTuberzy)
- Platforma Teachable — prosta w przejęciu
- Recurring revenue: 8 200 zł/mies. z subskrypcji

Właściciel sprzedaje, bo skupia się na offline bootcampach.',
  'Kursy online', 'Shopify', 16800, 151200, 28, 'active', false, '{}', 'sprzedajacy7@example.com', 'devmaster-kursy-programowania'
),

-- 8. Akcesoria do domu
(
  'Przytulnie.pl — tekstylia i akcesoria do domu handmade',
  'Sklep z ręcznie robionymi produktami do domu: poduszki, koce, świece, makramy. Mix własnej produkcji i starannie wybranych dostawców polskich rzemieślników.

Co wyróżnia sklep:
- 70% produktów własnej produkcji — trudno skopiować
- Etsy (3 200 sprzedaży, 4,9★) + własny sklep WooCommerce
- Sezonowość: Q4 generuje 45% rocznych przychodów
- Baza 6 700 klientów, 38% powrotnych
- Pinterest 95k obserwujących — bezpłatny ruch
- Pracuje 1 właścicielka + 2 szwaczki

Sprzedaż z powodu planowanej relokacji do innego kraju.',
  'Akcesoria do domu', 'WooCommerce', 19500, 175500, 41, 'active', true, '{}', 'sprzedajacy8@example.com', 'przytulnie-pl-tekstylia-handmade'
);
