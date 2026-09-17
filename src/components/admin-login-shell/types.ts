export interface AdminLoginShowcaseCard {
  description: string;
  image?: string;
  title: string;
}

export interface AdminLoginPartner {
  caption?: string;
  image?: string;
  name: string;
  showName?: boolean;
  slug: string;
}

export interface AdminLoginShellProps {
  accentColor?: string;
  accentRgb?: string;
  brandLogo?: string;
  brandLogoAlt?: string;
  brandTitle?: string;
  partnerTrustText?: string;
  partners?: AdminLoginPartner[];
  showcaseAriaLabel?: string;
  showcaseLanes?: AdminLoginShowcaseCard[][];
  subtitle?: string;
}
