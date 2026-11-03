export type ChannelLinks = Record<string, string>

export const tenantSocialChannels = [
  { key: 'x', label: 'X', mark: '𝕏', color: '#111827', placeholder: 'https://x.com/brand' },
  { key: 'telegram', label: 'Telegram', mark: '➤', color: '#0ba779', placeholder: 'https://t.me/brand' },
  { key: 'youtube', label: 'YouTube', mark: '▶', color: '#dc2029', placeholder: 'https://youtube.com/@brand' },
  { key: 'tiktok', label: 'TikTok', mark: '♪', color: '#111827', placeholder: 'https://tiktok.com/@brand' },
  { key: 'facebook', label: 'Facebook', mark: 'f', color: '#0ba779', placeholder: 'https://facebook.com/brand' },
  { key: 'discord', label: 'Discord', mark: 'D', color: '#0ba779', placeholder: 'https://discord.gg/brand' },
  { key: 'instagram', label: 'Instagram', mark: '◎', color: '#647182', placeholder: 'https://instagram.com/brand' },
  { key: 'medium', label: 'Medium', mark: 'M', color: '#111827', placeholder: 'https://medium.com/@brand' },
  { key: 'reddit', label: 'Reddit', mark: 'r', color: '#dc2029', placeholder: 'https://reddit.com/r/brand' },
  { key: 'linkedin', label: 'LinkedIn', mark: 'in', color: '#0ba779', placeholder: 'https://linkedin.com/company/brand' },
  { key: 'whatsapp', label: 'WhatsApp', mark: 'W', color: '#0ba779', placeholder: 'https://wa.me/10000000000' },
  { key: 'github', label: 'GitHub', mark: 'G', color: '#181818', placeholder: 'https://github.com/brand' },
] as const

export const createChannelLinkDraft = (options: ReadonlyArray<{ key: string }>, links: ChannelLinks): ChannelLinks =>
  Object.fromEntries(options.map(({ key }) => [key, links[key] || '']))

export const normalizeChannelLinks = (links: ChannelLinks): ChannelLinks => Object.fromEntries(
  Object.entries(links).map(([key, value]) => [key, value.trim()]).filter(([, value]) => value !== ''),
)

export function channelLinkError(value: string, english = false): string {
  const input = value.trim()
  if (!input) return ''
  const error = english ? 'Enter a valid HTTPS link without credentials.' : '请输入有效的 HTTPS 链接（不含账号密码）'
  try {
    const url = new URL(input)
    if (input.length > 2048 || !/^https:\/\/[^/]/i.test(input) || /^https:\/\/[^/?#]*@/i.test(input)
      || /[\s\\\u0000-\u001f\u007f]/u.test(input) || url.protocol !== 'https:' || !url.hostname || url.username || url.password) return error
  } catch { return error }
  return ''
}

export const channelLinksEqual = (left: ChannelLinks, right: ChannelLinks): boolean => {
  const a = normalizeChannelLinks(left), b = normalizeChannelLinks(right)
  return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(key => a[key] === b[key])
}
export const channelPlatformNames = (keys: string[], options: ReadonlyArray<{ key: string; label: string }>): string =>
  options.filter(({ key }) => keys.includes(key)).map(({ label }) => label).join(' · ')

export interface TenantChannelDetail {
  tenant_id: string
  tenant_name: string
  social_links: ChannelLinks
  expected_updated_at: string | null
  can_edit?: boolean
}
export interface TenantChannelSaveInput { social_links: ChannelLinks; expected_updated_at: string | null }
export interface TenantChannelSaveResult { changed: boolean; detail: TenantChannelDetail }
export interface TenantChannelSettingsProps {
  load: (signal: AbortSignal) => Promise<TenantChannelDetail>
  save: (input: TenantChannelSaveInput) => Promise<TenantChannelSaveResult>
  canEdit?: boolean
  formatUpdatedAt?: (value: string) => string
}
