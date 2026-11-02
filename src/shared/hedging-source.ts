export interface HedgingSourceIdentity {
  owner_type?: "merchant" | "tenant";
  owner_id?: number | string;
  home_site_id?: number | string | null;
  source_id?: number | string | null;
  source_name?: string | null;
  source_type?: "merchant" | "white_label" | "platform" | null;
}

export function hedgingOwnerKey(row: HedgingSourceIdentity & { agent_id?: number | string }): string {
  return `${row.owner_type ?? "merchant"}:${row.owner_id ?? row.agent_id ?? 0}`;
}
