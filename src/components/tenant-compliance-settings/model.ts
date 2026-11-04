import type { IconName } from '../icon'
import type {
    ComplianceDetail,
    ComplianceDraft,
    ComplianceMode,
    ComplianceProfile,
    ComplianceType
} from './types'

export const complianceTypes: {
    value: ComplianceType
    label: string
    icon: IconName
    description: string
}[] = [
    {
        value: 'terms',
        label: '用户协议',
        icon: 'file-text',
        description: '注册、账户使用和平台服务的基础条款'
    },
    {
        value: 'privacy',
        label: '隐私政策',
        icon: 'shield-check',
        description: '个人信息收集、使用、存储和共享说明'
    },
    {
        value: 'risk',
        label: '风险披露',
        icon: 'triangle-alert',
        description: '数字资产交易、价格波动和产品风险说明'
    },
    {
        value: 'cookies',
        label: 'Cookie 政策',
        icon: 'file-text',
        description: 'Cookie、本地存储和追踪技术的使用说明'
    },
    {
        value: 'aml',
        label: 'KYC / AML 声明',
        icon: 'circle-check',
        description: '身份认证、反洗钱和制裁合规声明'
    }
]
export const profileFields: {
    key: keyof ComplianceProfile
    label: string
    token: string
    max: number
    type?: string
}[] = [
    { key: 'legal_entity_name', label: '公司主体名称', token: 'LEGAL_ENTITY_NAME', max: 200 },
    { key: 'registration_number', label: '公司注册号', token: 'REGISTRATION_NO', max: 100 },
    { key: 'registered_address', label: '注册地址', token: 'REGISTERED_ADDRESS', max: 2000 },
    {
        key: 'effective_date',
        label: '协议生效日期',
        token: 'EFFECTIVE_DATE',
        max: 10,
        type: 'date'
    },
    { key: 'support_email', label: '协议联系邮箱', token: 'SUPPORT_EMAIL', max: 254, type: 'email' }
]
export const modeLabel = (mode: ComplianceMode) =>
    ({ platform: '平台模板', url: '自定义链接', content: '自定义正文' })[mode]
export const stateLabel = (state: string) =>
    ({
        disabled: '已停用',
        template_disabled: '模板不可用',
        unpublished: '尚未发布',
        incomplete: '待完善',
        ready: '已就绪'
    })[state] || '未配置'
export function toComplianceDraft(detail: ComplianceDetail): ComplianceDraft {
    return {
        profile: { ...detail.profile },
        agreements: detail.agreements.map(({ agreement_type, mode, is_enabled, url }) => ({
            agreement_type,
            mode,
            is_enabled,
            url
        }))
    }
}
export function normalizeCompliance(draft: ComplianceDraft): ComplianceDraft {
    return {
        profile: Object.fromEntries(
            Object.entries(draft.profile).map(([key, value]) => [key, value.trim()])
        ) as unknown as ComplianceProfile,
        agreements: draft.agreements.map((a) => ({ ...a, url: a.url.trim() }))
    }
}
export function validComplianceUrl(value: string): boolean {
    if (/[\x00-\x20\x7f<>"\\]/.test(value)) return false
    try {
        const u = new URL(value)
        return (
            /^https:\/\//i.test(value) &&
            u.protocol === 'https:' &&
            !!u.hostname &&
            !u.username &&
            !u.password
        )
    } catch {
        return false
    }
}
export function validateCompliance(draft: ComplianceDraft): Record<string, string> {
    const normalized = normalizeCompliance(draft),
        errors: Record<string, string> = {}
    const needsProfile = normalized.agreements.some((a) => a.mode === 'platform' && a.is_enabled)
    for (const field of profileFields) {
        const value = normalized.profile[field.key],
            key = `profile.${field.key}`
        if (needsProfile && !value) errors[key] = '启用平台模板时请完善该主体信息'
        else if (value.length > field.max) errors[key] = '内容超过长度限制'
        else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            errors[key] = '请输入有效邮箱地址'
        else if (
            field.type === 'date' &&
            value &&
            (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
                !Number.isFinite(Date.parse(value)) ||
                new Date(value).toISOString().slice(0, 10) !== value)
        )
            errors[key] = '请输入有效日期'
    }
    normalized.agreements.forEach((a, i) => {
        if (
            a.mode === 'url' &&
            (a.is_enabled || a.url) &&
            (!validComplianceUrl(a.url) || a.url.length > 2048)
        )
            errors[`agreements.${i}.url`] = '请填写不含账号密码的有效 HTTPS 链接'
    })
    return errors
}
