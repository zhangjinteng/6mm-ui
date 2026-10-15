export interface HedgingSourceIdentity {
    home_site_id?: number | string | null;
    source_id?: number | string | null;
    source_name?: string | null;
    source_type?: "merchant" | "white_label" | "platform" | null;
}
