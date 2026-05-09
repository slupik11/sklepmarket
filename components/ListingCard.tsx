import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Clock, Tag, ArrowRight } from "lucide-react";
import Badge from "./Badge";
import { formatPrice, formatRevenue, formatAge } from "@/lib/utils";
import type { Listing } from "@/lib/supabase/types";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const roi =
    listing.monthly_revenue > 0
      ? Math.round(listing.asking_price / listing.monthly_revenue)
      : null;

  return (
    <Link href={`/oferty/${listing.slug}`} className="group block">
      <article className="card card-hover h-full overflow-hidden">
        {/* Image */}
        <div className="relative h-44 w-full overflow-hidden bg-bg-section">
          {listing.images && listing.images.length > 0 ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <span className="text-4xl">🏪</span>
            </div>
          )}

          {/* Sold overlay */}
          {listing.status === "sold" && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-sm">
              <Badge variant="sold" />
            </div>
          )}

          {/* Verified badge */}
          {listing.verified && (
            <div className="absolute top-3 left-3">
              <Badge variant="verified" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category + Platform */}
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            <Badge variant="category" label={listing.category} />
            <Badge variant="platform" label={listing.platform} />
          </div>

          {/* Title */}
          <h3 className="mb-2 font-semibold text-ink line-clamp-1 group-hover:text-violet transition-colors">
            {listing.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-ink-muted line-clamp-2 mb-4 leading-relaxed">
            {listing.description}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 border-t border-edge pt-4">
            <div>
              <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-ink-faint mb-0.5">
                <Tag size={9} /> Cena
              </p>
              <p className="text-sm font-bold text-violet">
                {formatPrice(listing.asking_price)}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-ink-faint mb-0.5">
                <TrendingUp size={9} /> Przychód
              </p>
              <p className="text-sm font-semibold text-ink">
                {formatRevenue(listing.monthly_revenue)}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-ink-faint mb-0.5">
                <Clock size={9} /> Wiek
              </p>
              <p className="text-sm font-medium text-ink">
                {formatAge(listing.age_months)}
              </p>
            </div>
            {roi !== null && (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint mb-0.5">
                  ROI
                </p>
                <p className="text-sm font-medium text-ink">{roi} mies.</p>
              </div>
            )}
          </div>

          {/* CTA hint */}
          <div className="mt-4 flex items-center justify-end text-xs font-medium text-violet opacity-0 group-hover:opacity-100 transition-opacity">
            Zobacz ofertę <ArrowRight size={12} className="ml-1" />
          </div>
        </div>
      </article>
    </Link>
  );
}
