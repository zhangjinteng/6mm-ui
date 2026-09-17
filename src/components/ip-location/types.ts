export type IpLocationKind = "private" | "resolved" | "unavailable";

export interface IpLocationNames {
  en?: string | null;
  zh?: string | null;
}

export interface IpLocationInfo {
  address?: string | null;
  city?: string | null;
  city_names?: IpLocationNames | null;
  country?: string | null;
  country_code?: string | null;
  country_name?: string | null;
  country_names?: IpLocationNames | null;
  ip?: string | null;
  kind?: IpLocationKind | null;
  region?: string | null;
  region_names?: IpLocationNames | null;
  timezone?: string | null;
}

export interface IpLocationProps {
  countryFirst?: boolean;
  emptyText?: string;
  fallbackAddress?: string | null;
  info?: IpLocationInfo | null;
  ip?: string | null;
  locationFirst?: boolean;
  showIp?: boolean;
  showIpLabel?: boolean;
  showTooltip?: boolean;
  useEmojiFlag?: boolean;
}
