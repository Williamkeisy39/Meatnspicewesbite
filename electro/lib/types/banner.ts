export interface Banner {
  id: string;
  title?: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  status?: "active" | "inactive";
  placement?: "main" | "side";
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BannerQueryParams {
  status?: "active" | "inactive";
  placement?: "main" | "side";
}

export interface BannerInput {
  title?: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  status?: "active" | "inactive";
  placement?: "main" | "side";
  sort_order?: number;
}
