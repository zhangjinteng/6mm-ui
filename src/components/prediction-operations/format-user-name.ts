export const formatUserName = (niceName?: string | null, username?: string | null): string =>
    niceName?.trim() || username?.trim() || '-'
