export interface HedgingSourceIdentity {
    owner_type?: "merchant" | "tenant";
    owner_id?: number | string;
    home_site_id?: number | string | null;
    source_id?: number | string | null;
    source_name?: string | null;
    source_type?: "merchant" | "white_label" | "platform" | null;
}
export declare function hedgingOwnerKey(row: HedgingSourceIdentity & {
    agent_id?: number | string;
}): string;
