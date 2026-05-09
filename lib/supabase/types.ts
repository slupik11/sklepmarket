export type ListingStatus = "active" | "pending" | "sold";
export type SellRequestStatus = "new" | "reviewing" | "listed" | "rejected";

export type Listing = {
  id: string;
  title: string;
  description: string;
  category: string;
  platform: string;
  monthly_revenue: number;
  asking_price: number;
  age_months: number;
  status: ListingStatus;
  verified: boolean;
  images: string[];
  created_at: string;
  seller_email: string;
  slug: string;
};

export type Inquiry = {
  id: string;
  listing_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  message: string;
  created_at: string;
  handled?: boolean;
};

export type SellRequest = {
  id: string;
  shop_name: string;
  shop_url: string;
  platform: string;
  monthly_revenue: number;
  asking_price: number;
  description: string;
  seller_name: string;
  seller_email: string;
  seller_phone: string;
  status: SellRequestStatus;
  created_at: string;
};

// Minimal Database type for Supabase client
// Using 'any' for update/insert to avoid overly strict type constraints
export type Database = {
  public: {
    Tables: {
      listings: {
        Row: Listing;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Insert: Record<string, any>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Update: Record<string, any>;
      };
      inquiries: {
        Row: Inquiry;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Insert: Record<string, any>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Update: Record<string, any>;
      };
      sell_requests: {
        Row: SellRequest;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Insert: Record<string, any>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Update: Record<string, any>;
      };
    };
  };
};
