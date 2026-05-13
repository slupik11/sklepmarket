-- SklepMarket.pl — Supabase Schema
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
  notes text default '',
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
  notes text default '',
  admin_tags text[] default '{}',
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

-- ============================
-- BLOG POSTS
-- ============================

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  featured_image text,
  author_name text not null default 'SklepMarket Team',
  category text not null default 'Poradniki',
  tags text[] default '{}',
  published boolean default false,
  views integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists blog_posts_slug_idx on blog_posts(slug);
create index if not exists blog_posts_published_idx on blog_posts(published);
create index if not exists blog_posts_category_idx on blog_posts(category);
create index if not exists blog_posts_created_at_idx on blog_posts(created_at desc);

-- RLS
alter table blog_posts enable row level security;
create policy "Public read published posts" on blog_posts for select using (published = true);
create policy "Anon insert blog" on blog_posts for insert with check (true);
create policy "Anon update blog" on blog_posts for update using (true);
create policy "Anon delete blog" on blog_posts for delete using (true);

-- ============================
-- MIGRACJA — notatki i tagi admina
-- Uruchom to jeśli tabele już istnieją (po poprzednim deploymencie)
-- ============================

alter table sell_requests add column if not exists notes text default '';
alter table sell_requests add column if not exists admin_tags text[] default '{}';
alter table inquiries add column if not exists notes text default '';

-- Seed: 2 przykładowe posty
insert into blog_posts (slug, title, excerpt, content, category, published, author_name) values
(
  'jak-wycenic-sklep-internetowy',
  'Jak wycenić sklep internetowy przed sprzedażą?',
  'Poznaj sprawdzone metody wyceny sklepu e-commerce. Dowiedz się, jakie czynniki wpływają na cenę i jak przygotować sklep do sprzedaży, żeby uzyskać najlepszą ofertę.',
  '<h2>Metody wyceny sklepu internetowego</h2>
<p>Wycena sklepu e-commerce to proces wymagający uwzględnienia wielu czynników. W Polsce najczęściej stosuje się dwie główne metody.</p>
<h3>1. Wielokrotność miesięcznego zysku (SDE Multiple)</h3>
<p>Najpopularniejsza metoda w branży e-commerce. Wartość sklepu = <strong>miesięczny zysk netto × mnożnik</strong>. Mnożnik zazwyczaj wynosi 20–40x dla sklepów z historią poniżej 2 lat i 30–60x dla stabilnych biznesów.</p>
<h3>2. Wielokrotność rocznego przychodu</h3>
<p>Stosowana gdy marże są trudne do zweryfikowania. Wartość sklepu = <strong>roczny przychód × 0,3–1,5x</strong>, w zależności od kategorii, marży i potencjału wzrostu.</p>
<h2>Co podnosi wartość sklepu?</h2>
<ul>
<li><strong>Stabilna historia przychodów</strong> — minimum 12 miesięcy danych</li>
<li><strong>Zdywersyfikowane kanały sprzedaży</strong> — nie tylko jeden kanał reklamowy</li>
<li><strong>Własna baza klientów</strong> — lista emailowa, wysoki % powrotnych klientów</li>
<li><strong>Udokumentowane procesy</strong> — SOPy, automatyzacje, niezależność od właściciela</li>
<li><strong>Silna marka</strong> — opinie, media społecznościowe, SEO</li>
</ul>
<h2>Jak przygotować sklep do sprzedaży?</h2>
<p>Przygotowanie sklepu do sprzedaży powinno zacząć się minimum 6 miesięcy przed planowaną transakcją. Skup się na dokumentacji finansowej, optymalizacji procesów i czyszczeniu danych.</p>',
  'Poradniki',
  true,
  'SklepMarket Team'
),
(
  '10-bledow-przy-kupnie-sklepu',
  '10 błędów przy kupnie gotowego sklepu online',
  'Unikaj najczęstszych pułapek przy zakupie sklepu internetowego. Lista błędów, które mogą kosztować Cię tysiące złotych i miesiące frustracji.',
  '<h2>Najczęstsze błędy kupujących sklepy online</h2>
<p>Kupno gotowego sklepu to świetna inwestycja — ale tylko jeśli unikniesz podstawowych błędów w procesie due diligence.</p>
<h3>1. Brak weryfikacji danych finansowych</h3>
<p>Nie kupuj na podstawie screenshots z panelu sprzedającego. Żądaj dostępu do Google Analytics, konta bankowego i systemu zamówień za minimum 12 miesięcy.</p>
<h3>2. Ignorowanie sezonowości</h3>
<p>Sklep może wyglądać świetnie w Q4, a generować 30% tych przychodów w Q2. Zawsze analizuj dane miesięcznie za cały rok.</p>
<h3>3. Brak analizy źródeł ruchu</h3>
<p>Jeśli 80% ruchu pochodzi z jednego źródła (np. jednej frazy SEO lub jednej kampanii reklamowej), to ogromne ryzyko. Dywersyfikacja źródeł to klucz do stabilności.</p>
<h3>4. Pominięcie kwestii prawnych</h3>
<p>Umowa kupna-sprzedaży, transfer domeny, praw do marki, bazy klientów (RODO) — każdy z tych elementów wymaga uwagi prawnika.</p>
<h3>5. Przepłacenie za potencjał, nie wyniki</h3>
<p>Płać za udokumentowane wyniki, nie za „potencjał". Każdy sprzedający powie, że sklep ma ogromny potencjał wzrostu.</p>
<h3>6. Brak planu na pierwsze 90 dni</h3>
<p>Co zrobisz w pierwszych 3 miesiącach? Bez planu łatwo o paraliż decyzyjny i utratę momentum sklepu.</p>
<h3>7. Zakup bez wsparcia po transakcji</h3>
<p>Zadbaj o to, żeby sprzedający był dostępny przez minimum 30 dni po zakupie. To standard w profesjonalnych transakcjach.</p>
<h3>8. Ignorowanie reputacji online</h3>
<p>Sprawdź opinie na Google, Allegro, Trustpilot. Negatywna reputacja jest bardzo trudna do naprawienia.</p>
<h3>9. Brak analizy konkurencji</h3>
<p>Ile sklepów sprzedaje podobne produkty? Jaki mają share of voice? Czy bariera wejścia jest wystarczająco wysoka?</p>
<h3>10. Emocjonalne podejście do negocjacji</h3>
<p>Zakochanie się w sklepie to największa pułapka. Zawsze miej BATNA (najlepszą alternatywę) i bądź gotowy odejść od stołu.</p>',
  'Poradniki',
  true,
  'SklepMarket Team'
);
