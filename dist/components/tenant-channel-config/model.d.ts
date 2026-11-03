export type ChannelLinks = Record<string, string>;
export declare const tenantSocialChannels: readonly [{
    readonly key: "x";
    readonly label: "X";
    readonly mark: "𝕏";
    readonly color: "#111827";
    readonly placeholder: "https://x.com/brand";
}, {
    readonly key: "telegram";
    readonly label: "Telegram";
    readonly mark: "➤";
    readonly color: "#0ba779";
    readonly placeholder: "https://t.me/brand";
}, {
    readonly key: "youtube";
    readonly label: "YouTube";
    readonly mark: "▶";
    readonly color: "#dc2029";
    readonly placeholder: "https://youtube.com/@brand";
}, {
    readonly key: "tiktok";
    readonly label: "TikTok";
    readonly mark: "♪";
    readonly color: "#111827";
    readonly placeholder: "https://tiktok.com/@brand";
}, {
    readonly key: "facebook";
    readonly label: "Facebook";
    readonly mark: "f";
    readonly color: "#0ba779";
    readonly placeholder: "https://facebook.com/brand";
}, {
    readonly key: "discord";
    readonly label: "Discord";
    readonly mark: "D";
    readonly color: "#0ba779";
    readonly placeholder: "https://discord.gg/brand";
}, {
    readonly key: "instagram";
    readonly label: "Instagram";
    readonly mark: "◎";
    readonly color: "#647182";
    readonly placeholder: "https://instagram.com/brand";
}, {
    readonly key: "medium";
    readonly label: "Medium";
    readonly mark: "M";
    readonly color: "#111827";
    readonly placeholder: "https://medium.com/@brand";
}, {
    readonly key: "reddit";
    readonly label: "Reddit";
    readonly mark: "r";
    readonly color: "#dc2029";
    readonly placeholder: "https://reddit.com/r/brand";
}, {
    readonly key: "linkedin";
    readonly label: "LinkedIn";
    readonly mark: "in";
    readonly color: "#0ba779";
    readonly placeholder: "https://linkedin.com/company/brand";
}, {
    readonly key: "whatsapp";
    readonly label: "WhatsApp";
    readonly mark: "W";
    readonly color: "#0ba779";
    readonly placeholder: "https://wa.me/10000000000";
}, {
    readonly key: "github";
    readonly label: "GitHub";
    readonly mark: "G";
    readonly color: "#181818";
    readonly placeholder: "https://github.com/brand";
}];
export declare const createChannelLinkDraft: (options: ReadonlyArray<{
    key: string;
}>, links: ChannelLinks) => ChannelLinks;
export declare const normalizeChannelLinks: (links: ChannelLinks) => ChannelLinks;
export declare function channelLinkError(value: string, english?: boolean): string;
export declare const channelLinksEqual: (left: ChannelLinks, right: ChannelLinks) => boolean;
export declare const channelPlatformNames: (keys: string[], options: ReadonlyArray<{
    key: string;
    label: string;
}>) => string;
export interface TenantChannelDetail {
    tenant_id: string;
    tenant_name: string;
    social_links: ChannelLinks;
    expected_updated_at: string | null;
    can_edit?: boolean;
}
export interface TenantChannelSaveInput {
    social_links: ChannelLinks;
    expected_updated_at: string | null;
}
export interface TenantChannelSaveResult {
    changed: boolean;
    detail: TenantChannelDetail;
}
export interface TenantChannelSettingsProps {
    load: (signal: AbortSignal) => Promise<TenantChannelDetail>;
    save: (input: TenantChannelSaveInput) => Promise<TenantChannelSaveResult>;
    canEdit?: boolean;
    formatUpdatedAt?: (value: string) => string;
}
