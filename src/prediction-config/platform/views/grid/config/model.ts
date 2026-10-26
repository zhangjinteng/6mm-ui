export interface GridLayout {
    row_count: string
    column_count: string
    column_duration_seconds: string
    price_band_width: string
    price_decimals?: number | null
    effective_from_ms: string
    editable: boolean
    affected_site_ids: string[]
}
export interface GridSnapshot {
    config_id?: string
    requested_agent_id?: string
    agent_id?: string | null
    inherited?: boolean
    default_config_id?: string
    default_version?: string
    default_resolution_epoch?: string
    default_enabled?: boolean
    effective_enabled?: boolean
    default_target_rtp?: string
    default_min_order_amount?: string
    default_max_order_amount?: string
    layout?: GridLayout
    site_id: string
    symbol: string
    layout_version: string
    site_version: string
    effective_from_ms: string
    enabled: boolean
    target_rtp: string
    min_multiplier: string
    max_multiplier: string
    min_order_amount: string
    max_order_amount: string
}
export interface GridCommand {
    based_on_config_id?: string
    based_on_default_version?: string
    based_on_default_resolution_epoch?: string
    site_id: string
    symbol: string
    based_on_layout_version: string
    based_on_site_version: string
    client_request_id: string
    reason: string
    changes: Partial<Pick<GridSnapshot, 'enabled' | 'target_rtp' | 'min_multiplier' | 'max_multiplier' | 'min_order_amount' | 'max_order_amount'> & Pick<GridLayout, 'price_band_width' | 'column_duration_seconds' | 'price_decimals' | 'row_count' | 'column_count'>>
}

// Only the editable draft receives a default; stored snapshots and pending commands stay intact.
export function createGridDraft(snapshot: GridSnapshot, canEdit = true): GridSnapshot {
    const draft = structuredClone(snapshot)
    if (canEdit && draft.layout?.editable && draft.layout.price_decimals == null) {
        draft.layout.price_decimals = 3
    }
    return draft
}
export interface PendingGridCommand {
    schema: 1
    operator_id: string
    command: GridCommand
}
export interface GridSaveReview {
    operator_id: string
    command: GridCommand
}
export type PendingStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
export interface GridOperationResult {
    operation_status: 'SUCCEEDED'
    operation_id: string
    site_id: string
    symbol: string
    layout_version: string
    site_version: string
    effective_from_ms: string
    changed: boolean
    cache_state: 'PENDING' | 'DONE' | 'NOT_REQUIRED'
}

const STORAGE_KEY = 'grid.config.pending.v1'
const decimalPattern = /^(0|[1-9]\d*)(?:\.(\d+))?$/
const positiveIntegerPattern = /^[1-9]\d*$/
const symbolPattern = /^[A-Z0-9]{2,32}$/
const commandKeys = ['site_id', 'symbol', 'based_on_layout_version', 'based_on_site_version', 'client_request_id', 'reason', 'changes']
const identityKeys = ['config_id','requested_agent_id','agent_id','inherited','default_config_id','default_version','default_resolution_epoch','default_enabled','effective_enabled','default_target_rtp','default_min_order_amount','default_max_order_amount'] as const
const commandIdentityKeys = ['based_on_config_id','based_on_default_version','based_on_default_resolution_epoch'] as const
const layoutChangeKeys = ['price_band_width', 'column_duration_seconds', 'price_decimals'] as const
const changeKeys = ['enabled', 'target_rtp', 'min_multiplier', 'max_multiplier', 'min_order_amount', 'max_order_amount'] as const

function object(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === 'object' && !Array.isArray(value)
}
function requireValid(value: unknown, code = 'INVALID_GRID_CONFIGURATION'): asserts value {
    if (!value) throw new Error(code)
}
function exactKeys(value: Record<string, unknown>, expected: readonly string[]) {
    requireValid(Object.keys(value).length === expected.length && Object.keys(value).every(key => expected.includes(key)), 'PENDING_CORRUPT')
}
export function canonicalDecimal(value: unknown, maxScale?: number): string {
    requireValid(typeof value === 'string' && value.length <= 128 && decimalPattern.test(value), 'INVALID_DECIMAL')
    const [rawWhole, rawFraction = ''] = value.split('.')
    const whole = rawWhole.replace(/^0+(?=\d)/, '')
    const fraction = rawFraction.replace(/0+$/, '')
    requireValid(maxScale === undefined || fraction.length <= maxScale, 'INVALID_DECIMAL')
    return fraction ? whole + '.' + fraction : whole
}
function decimalParts(value: string) {
    const canonical = canonicalDecimal(value)
    const [whole, fraction = ''] = canonical.split('.')
    return { whole, fraction }
}
export function compareDecimal(left: string, right: string): number {
    const a = decimalParts(left), b = decimalParts(right)
    if (a.whole.length !== b.whole.length) return a.whole.length > b.whole.length ? 1 : -1
    if (a.whole !== b.whole) return a.whole > b.whole ? 1 : -1
    const scale = Math.max(a.fraction.length, b.fraction.length)
    const af = a.fraction.padEnd(scale, '0'), bf = b.fraction.padEnd(scale, '0')
    return af === bf ? 0 : af > bf ? 1 : -1
}
function shift(value: string, places: number): string {
    const { whole, fraction } = decimalParts(value)
    const digits = whole + fraction
    let point = whole.length + places
    let shifted: string
    if (point <= 0) shifted = '0.' + '0'.repeat(-point) + digits
    else if (point >= digits.length) shifted = digits + '0'.repeat(point - digits.length)
    else shifted = digits.slice(0, point) + '.' + digits.slice(point)
    const [integer, decimals = ''] = shifted.split('.')
    const normalizedInteger = integer.replace(/^0+(?=\d)/, '') || '0'
    const normalizedDecimals = decimals.replace(/0+$/, '')
    return normalizedDecimals ? normalizedInteger + '.' + normalizedDecimals : normalizedInteger
}
export function ratioToPercent(value: string): string {
    const ratio = canonicalDecimal(value)
    requireValid(compareDecimal(ratio, '0') > 0 && compareDecimal(ratio, '1') <= 0, 'INVALID_RTP')
    return shift(ratio, 2)
}
export function percentToRatio(value: string): string {
    const percent = canonicalDecimal(value)
    requireValid(compareDecimal(percent, '0') > 0 && compareDecimal(percent, '100') < 0, 'INVALID_RTP')
    return shift(percent, -2)
}
export function secureRequestId(source: { getRandomValues(array: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> } = globalThis.crypto): string {
    requireValid(source && typeof source.getRandomValues === 'function', 'SECURE_RANDOM_UNAVAILABLE')
    const bytes = source.getRandomValues(new Uint8Array(16))
    requireValid(bytes instanceof Uint8Array && bytes.length === 16, 'SECURE_RANDOM_UNAVAILABLE')
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = [...bytes].map(value => value.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
function layoutDuration(value: unknown): string {
    requireValid(typeof value === 'string' && positiveIntegerPattern.test(value) && compareDecimal(value, '25') <= 0, 'INVALID_LAYOUT_DURATION')
    return value
}
function newLayoutDuration(value: unknown): string {
    const duration = layoutDuration(value)
    requireValid(compareDecimal(duration, '10') <= 0, 'INVALID_LAYOUT_DURATION')
    return duration
}
function layoutWidth(value: unknown, maxScale?: number): string {
    const width = canonicalDecimal(value, maxScale)
    requireValid(compareDecimal(width, '0') > 0, 'INVALID_LAYOUT_WIDTH')
    return width
}
export function hasGridPriceBandPrecisionError(value: unknown): boolean {
    if (typeof value !== 'string') return false
    const fraction = /^(?:0|[1-9]\d*)\.(\d+)$/.exec(value)?.[1]
    return fraction !== undefined && fraction.length > 8
}
function storedPriceDecimals(value: unknown): number | null {
    requireValid(value === null || (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 18), 'INVALID_LAYOUT_PRECISION')
    return value as number | null
}
function newPriceDecimals(value: unknown): number {
    requireValid(typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 8, 'INVALID_LAYOUT_PRECISION')
    return value
}
function validatePricePrecision(width: string, decimals: number | null | undefined) {
    if (decimals == null) return
    requireValid((canonicalDecimal(width).split('.')[1] ?? '').length <= decimals, 'INVALID_LAYOUT_PRECISION')
}
function validateLayoutHorizon(columns: string, duration: string) {
    // Counts and duration are bounded before conversion; price values stay strings.
    requireValid(5 + (Number(columns) + 1) * Number(duration) <= 120, 'INVALID_LAYOUT_HORIZON')
}
export function normalizeLayout(value: unknown): GridLayout {
    requireValid(object(value), 'INVALID_GRID_LAYOUT')
    exactKeys(value, ['row_count', 'column_count', 'column_duration_seconds', 'price_band_width', 'effective_from_ms', 'editable', 'affected_site_ids', ...('price_decimals' in value ? ['price_decimals'] : [])])
    // Read historical positive values without imposing the policy for new writes.
    requireValid([value.row_count, value.column_count, value.column_duration_seconds].every(item => typeof item === 'string' && item.length <= 128 && positiveIntegerPattern.test(item)), 'INVALID_GRID_LAYOUT')
    requireValid(typeof value.effective_from_ms === 'string' && /^\d+$/.test(value.effective_from_ms), 'INVALID_GRID_LAYOUT')
    requireValid(typeof value.editable === 'boolean', 'INVALID_GRID_LAYOUT')
    requireValid(Array.isArray(value.affected_site_ids) && value.affected_site_ids.every(item => typeof item === 'string' && item.length > 0 && item.length <= 64 && item.trim() === item), 'INVALID_GRID_LAYOUT')
    requireValid(new Set(value.affected_site_ids).size === value.affected_site_ids.length && (!value.editable || value.affected_site_ids.length > 0), 'INVALID_GRID_LAYOUT')
    return {
        row_count: value.row_count as string,
        column_count: value.column_count as string,
        column_duration_seconds: value.column_duration_seconds as string,
        price_band_width: layoutWidth(value.price_band_width),
        ...('price_decimals' in value ? { price_decimals: storedPriceDecimals(value.price_decimals) } : {}),
        effective_from_ms: value.effective_from_ms,
        editable: value.editable,
        affected_site_ids: [...value.affected_site_ids] as string[]
    }
}
export function hasLayoutChanges(source: GridSnapshot, draft: GridSnapshot, allowLayout = false): boolean {
    return !!(allowLayout && source.layout?.editable && draft.layout && layoutChangeKeys.some(key => source.layout![key] !== draft.layout![key]))
}
export function normalizeSnapshot(value: unknown): GridSnapshot {
    requireValid(object(value), 'INVALID_GRID_CONFIGURATION')
    const required = ['site_id', 'symbol', 'layout_version', 'site_version', 'effective_from_ms', 'enabled', 'target_rtp', 'min_multiplier', 'max_multiplier', 'min_order_amount', 'max_order_amount']
    exactKeys(value, [...required, ...('layout' in value ? ['layout'] : []), ...('config_id' in value ? identityKeys : [])])
    requireValid(typeof value.site_id === 'string' && value.site_id.length > 0 && value.site_id.length <= 64 && value.site_id.trim() === value.site_id, 'INVALID_GRID_CONFIGURATION')
    requireValid(typeof value.symbol === 'string' && symbolPattern.test(value.symbol), 'INVALID_GRID_CONFIGURATION')
    requireValid([value.layout_version, value.site_version].every(item => typeof item === 'string' && positiveIntegerPattern.test(item)), 'INVALID_GRID_CONFIGURATION')
    requireValid(typeof value.effective_from_ms === 'string' && /^\d+$/.test(value.effective_from_ms), 'INVALID_GRID_CONFIGURATION')
    requireValid(typeof value.enabled === 'boolean', 'INVALID_GRID_CONFIGURATION')
    const result: GridSnapshot = {
        site_id: value.site_id,
        symbol: value.symbol,
        layout_version: value.layout_version as string,
        site_version: value.site_version as string,
        effective_from_ms: value.effective_from_ms as string,
        enabled: value.enabled,
        target_rtp: canonicalDecimal(value.target_rtp),
        min_multiplier: canonicalDecimal(value.min_multiplier, 2),
        max_multiplier: canonicalDecimal(value.max_multiplier, 2),
        min_order_amount: canonicalDecimal(value.min_order_amount, 8),
        max_order_amount: canonicalDecimal(value.max_order_amount, 8)
    }
    requireValid(compareDecimal(result.target_rtp, '0') > 0 && compareDecimal(result.target_rtp, '1') <= 0, 'INVALID_GRID_CONFIGURATION')
    requireValid(compareDecimal(result.min_multiplier, '1') >= 0 && compareDecimal(result.max_multiplier, result.min_multiplier) >= 0, 'INVALID_GRID_CONFIGURATION')
    requireValid(compareDecimal(result.min_order_amount, '0') > 0 && compareDecimal(result.max_order_amount, result.min_order_amount) >= 0, 'INVALID_GRID_CONFIGURATION')
    if ('config_id' in value) {
        for (const key of ['config_id','default_config_id','default_version','default_resolution_epoch'] as const) {
            requireValid(typeof value[key] === 'string' && positiveIntegerPattern.test(value[key] as string) && compareDecimal(value[key] as string,'9223372036854775807') <= 0)
            result[key] = value[key] as string
        }
        requireValid(typeof value.requested_agent_id === 'string' && /^(0|[1-9][0-9]*)$/.test(value.requested_agent_id) && compareDecimal(value.requested_agent_id,'9223372036854775807') <= 0)
        requireValid(value.agent_id === null || (value.agent_id === value.requested_agent_id && value.agent_id !== '0'))
        result.requested_agent_id=value.requested_agent_id;result.agent_id=value.agent_id as string|null
        for (const key of ['inherited','default_enabled','effective_enabled'] as const) { requireValid(typeof value[key]==='boolean');result[key]=value[key] as boolean }
        for (const key of ['default_target_rtp','default_min_order_amount','default_max_order_amount'] as const) result[key]=canonicalDecimal(value[key])
    }
    if ('layout' in value) result.layout = normalizeLayout(value.layout)
    return result
}
export function normalizeSnapshotForTarget(value: unknown, siteId: string, symbol: string): GridSnapshot {
    const result = normalizeSnapshot(value)
    requireValid(result.site_id === siteId && result.symbol === symbol, 'INVALID_GRID_TARGET')
    return result
}
export function makeCommand(sourceValue: unknown, draftValue: unknown, reason: string, requestId: string, allowMultipliers: boolean, allowLayout = false): GridCommand {
    if (object(sourceValue) && sourceValue.site_version === '0') return makeCreationCommand(sourceValue, draftValue, reason, requestId, allowMultipliers, allowLayout)
    const sourceWidth = object(sourceValue) && object(sourceValue.layout) ? sourceValue.layout.price_band_width : undefined
    const enteredWidth = object(draftValue) && object(draftValue.layout) ? draftValue.layout.price_band_width : undefined
    requireValid(sourceWidth === enteredWidth || !hasGridPriceBandPrecisionError(enteredWidth), 'INVALID_LAYOUT_PRECISION')
    const source = normalizeSnapshot(sourceValue), draft = normalizeSnapshot(draftValue)
    requireValid(source.site_id === draft.site_id && source.symbol === draft.symbol, 'INVALID_GRID_TARGET')
    requireValid(typeof reason === 'string' && reason.length <= 500 && reason.trim().length > 0 && !reason.includes('\0'), 'INVALID_REASON')
    requireValid(typeof requestId === 'string' && /^[A-Za-z0-9_-]{8,64}$/.test(requestId), 'INVALID_REQUEST_ID')
    requireValid(source.config_id && source.default_version && source.default_resolution_epoch, 'CONFIG_IDENTITY_REQUIRED')
    requireValid(identityKeys.every(key => source[key] === draft[key]), 'INVALID_GRID_TARGET')
    if (source.requested_agent_id !== '0') {
        requireValid(!draft.enabled || source.default_enabled, 'PLATFORM_LIMIT')
        requireValid(compareDecimal(draft.target_rtp, source.default_target_rtp!) <= 0 && compareDecimal(draft.min_order_amount, source.default_min_order_amount!) >= 0 && compareDecimal(draft.max_order_amount, source.default_max_order_amount!) <= 0, 'PLATFORM_LIMIT')
    }
    const changes: GridCommand['changes'] = {}
    for (const key of changeKeys) {
        if (source[key] !== draft[key]) changes[key] = draft[key] as never
    }
    for (const key of layoutChangeKeys) {
        if (source.layout?.[key] !== draft.layout?.[key]) {
            requireValid(allowLayout && source.layout?.editable && draft.layout, 'FIELD_FORBIDDEN')
            changes[key] = draft.layout[key] as never
        }
    }
    if (layoutChangeKeys.some(key => key in changes)) {
        const layout = source.layout!
        if ('price_decimals' in changes) newPriceDecimals(changes.price_decimals)
        validatePricePrecision(draft.layout!.price_band_width, draft.layout!.price_decimals)
        // Historical values and pending receipts can retain the previous 18-place precision.
        layoutWidth(changes.price_band_width ?? layout.price_band_width, 18)
        if ('column_duration_seconds' in changes) newLayoutDuration(changes.column_duration_seconds)
        const duration = layoutDuration(changes.column_duration_seconds ?? layout.column_duration_seconds)
        requireValid(compareDecimal(layout.row_count, '10000') <= 0 && compareDecimal(layout.column_count, '10000') <= 0 && Number(layout.row_count) * Number(layout.column_count) <= 10000, 'INVALID_GRID_LAYOUT')
        validateLayoutHorizon(layout.column_count, duration)
    }
    if (!allowMultipliers && ('min_multiplier' in changes || 'max_multiplier' in changes)) throw new Error('FIELD_FORBIDDEN')
    requireValid(Object.keys(changes).length > 0, 'EMPTY_CHANGES')
    return {
        site_id: source.site_id,
        symbol: source.symbol,
        based_on_layout_version: source.layout_version,
        based_on_site_version: source.site_version,
        based_on_config_id: source.config_id,
        based_on_default_version: source.default_version,
        based_on_default_resolution_epoch: source.default_resolution_epoch,
        client_request_id: requestId,
        reason,
        changes
    }
}
function makeCreationCommand(source: Record<string, unknown>, draftValue: unknown, reason: string, requestId: string, allowMultipliers: boolean, allowLayout: boolean): GridCommand {
    requireValid(allowMultipliers && allowLayout && object(draftValue) && source.site_id === draftValue.site_id && source.symbol === draftValue.symbol, 'INVALID_GRID_TARGET')
    requireValid(source.layout_version === draftValue.layout_version && draftValue.site_version === '0', 'INVALID_GRID_TARGET')
    if (source.layout_version === '0' && object(draftValue.layout)) requireValid(!hasGridPriceBandPrecisionError(draftValue.layout.price_band_width), 'INVALID_LAYOUT_PRECISION')
    const draft = normalizeSnapshot({ ...draftValue, enabled: false, site_version: '1', layout_version: source.layout_version === '0' ? '1' : source.layout_version })
    const changes: GridCommand['changes'] = { enabled: false }
    for (const key of changeKeys) if (key !== 'enabled') changes[key] = draft[key]
    const layoutKeys = ['row_count', 'column_count', ...layoutChangeKeys] as const
    if (source.layout_version === '0') {
        requireValid(draft.layout, 'INVALID_GRID_LAYOUT')
        newLayoutDuration(draft.layout.column_duration_seconds)
        for (const key of layoutKeys) {
            if (key === 'price_decimals' && draft.layout.price_decimals == null) continue
            changes[key] = draft.layout[key] as never
        }
        validatePricePrecision(draft.layout.price_band_width, draft.layout.price_decimals)
    } else {
        const layout = source.layout
        requireValid(object(layout) && draft.layout && layoutKeys.every(key => layout[key] === draft.layout![key]), 'FIELD_FORBIDDEN')
    }
    const command = { site_id: draft.site_id, symbol: draft.symbol, based_on_layout_version: source.layout_version as string,
        based_on_site_version: '0', client_request_id: requestId, reason, changes }
    commandShape(command)
    return command
}
function commandShape(value: unknown): asserts value is GridCommand {
    requireValid(object(value), 'PENDING_CORRUPT')
    exactKeys(value, [...commandKeys, ...('based_on_config_id' in value ? commandIdentityKeys : [])])
    if ('based_on_config_id' in value) for (const key of commandIdentityKeys) requireValid(typeof value[key] === 'string' && positiveIntegerPattern.test(value[key] as string) && compareDecimal(value[key] as string,'9223372036854775807') <= 0, 'PENDING_CORRUPT')
    requireValid(typeof value.site_id === 'string' && value.site_id.length > 0 && value.site_id.length <= 64 && value.site_id.trim() === value.site_id, 'PENDING_CORRUPT')
    requireValid(typeof value.symbol === 'string' && symbolPattern.test(value.symbol), 'PENDING_CORRUPT')
    const creating = value.based_on_site_version === '0'
    requireValid(typeof value.based_on_layout_version === 'string' && (positiveIntegerPattern.test(value.based_on_layout_version) || (creating && value.based_on_layout_version === '0')), 'PENDING_CORRUPT')
    requireValid(typeof value.based_on_site_version === 'string' && (creating || positiveIntegerPattern.test(value.based_on_site_version)), 'PENDING_CORRUPT')
    requireValid(typeof value.client_request_id === 'string' && /^[A-Za-z0-9_-]{8,64}$/.test(value.client_request_id), 'PENDING_CORRUPT')
    requireValid(typeof value.reason === 'string' && value.reason.length <= 500 && value.reason.trim().length > 0 && !value.reason.includes('\0'), 'PENDING_CORRUPT')
    const allowed = [...changeKeys, ...layoutChangeKeys, ...(creating ? ['row_count', 'column_count'] : [])]
    requireValid(object(value.changes) && Object.keys(value.changes).length > 0 && Object.keys(value.changes).every(key => allowed.includes(key)), 'PENDING_CORRUPT')
    for (const [key, item] of Object.entries(value.changes)) {
        if (key === 'enabled') requireValid(typeof item === 'boolean', 'PENDING_CORRUPT')
        else if (key === 'row_count' || key === 'column_count') requireValid(typeof item === 'string' && /^[1-9]\d{0,4}$/.test(item), 'INVALID_GRID_LAYOUT')
        else if (key === 'price_decimals') newPriceDecimals(item)
        else if (key === 'price_band_width') layoutWidth(item, 18)
        else if (key === 'column_duration_seconds') layoutDuration(item)
        else canonicalDecimal(item, key.includes('order_amount') ? 8 : key.includes('multiplier') ? 2 : undefined)
    }
    if (creating) {
        requireValid(!('based_on_config_id' in value) && value.changes.enabled === false, 'PENDING_CORRUPT')
        const layoutNew = value.based_on_layout_version === '0'
        exactKeys(value.changes, [...changeKeys, ...(layoutNew ? ['row_count', 'column_count', ...layoutChangeKeys.filter(key => key !== 'price_decimals' || Object.prototype.hasOwnProperty.call(value.changes, key))] : [])])
        const business = Object.fromEntries(changeKeys.map(key => [key, (value.changes as Record<string, unknown>)[key]]))
        normalizeSnapshot({ ...business, site_id: value.site_id, symbol: value.symbol, site_version: '1', layout_version: '1', effective_from_ms: '0' })
        requireValid(compareDecimal(value.based_on_layout_version as string,'9223372036854775807') <= 0, 'PENDING_CORRUPT')
        if (layoutNew) {
            const c = value.changes
            requireValid(Number(c.row_count) * Number(c.column_count) <= 10000, 'INVALID_GRID_LAYOUT')
            layoutWidth(c.price_band_width, 8)
            validateLayoutHorizon(c.column_count as string, c.column_duration_seconds as string)
        }
    }
}
function deepFreeze<T>(value: T): T {
    if (value && typeof value === 'object') {
        Object.freeze(value)
        for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child)
    }
    return value
}
function same(left: PendingGridCommand | null, right: PendingGridCommand) {
    return !!left && JSON.stringify(left) === JSON.stringify(right)
}
export function readPending(storage: PendingStorage): PendingGridCommand | null {
    const raw = storage.getItem(STORAGE_KEY)
    if (raw === null) return null
    requireValid(raw.length <= 32768, 'PENDING_CORRUPT')
    let value: unknown
    try { value = JSON.parse(raw) } catch { throw new Error('PENDING_CORRUPT') }
    requireValid(object(value), 'PENDING_CORRUPT')
    exactKeys(value, ['schema', 'operator_id', 'command'])
    requireValid(value.schema === 1 && typeof value.operator_id === 'string' && positiveIntegerPattern.test(value.operator_id), 'PENDING_CORRUPT')
    commandShape(value.command)
    return deepFreeze(value as unknown as PendingGridCommand)
}
export function persistPending(storage: PendingStorage, operatorId: string, command: GridCommand): PendingGridCommand {
    requireValid(positiveIntegerPattern.test(operatorId), 'IDENTITY_UNCONFIRMED')
    requireValid(readPending(storage) === null, 'PENDING_EXISTS')
    commandShape(command)
    const value: PendingGridCommand = { schema: 1, operator_id: operatorId, command: JSON.parse(JSON.stringify(command)) }
    storage.setItem(STORAGE_KEY, JSON.stringify(value))
    const stored = readPending(storage)
    requireValid(same(stored, value), 'PERSISTENCE_UNAVAILABLE')
    return stored!
}
export function captureSaveReview(operatorId: string, command: GridCommand): GridSaveReview {
    requireValid(positiveIntegerPattern.test(operatorId), 'IDENTITY_UNCONFIRMED')
    commandShape(command)
    return deepFreeze({ operator_id: operatorId, command: structuredClone(command) })
}
export function persistReviewedCommand(storage: PendingStorage, review: GridSaveReview, currentOperatorId: string, currentCommand: GridCommand): PendingGridCommand {
    commandShape(review.command)
    commandShape(currentCommand)
    requireValid(review.operator_id === currentOperatorId && JSON.stringify(review.command) === JSON.stringify(currentCommand), 'STALE_CONFIRMATION')
    return persistPending(storage, review.operator_id, review.command)
}
export function pendingForActor(storage: PendingStorage, operatorId: string): { status: 'none' | 'bound' | 'foreign'; pending?: PendingGridCommand } {
    const pending = readPending(storage)
    if (!pending) return { status: 'none' }
    return pending.operator_id === operatorId ? { status: 'bound', pending } : { status: 'foreign', pending }
}
function operationResult(value: unknown, pending: PendingGridCommand): value is GridOperationResult {
    if (!object(value)) return false
    return value.operation_status === 'SUCCEEDED' &&
        typeof value.operation_id === 'string' && positiveIntegerPattern.test(value.operation_id) &&
        value.site_id === pending.command.site_id && value.symbol === pending.command.symbol &&
        typeof value.layout_version === 'string' && positiveIntegerPattern.test(value.layout_version) &&
        typeof value.site_version === 'string' && positiveIntegerPattern.test(value.site_version) &&
        typeof value.effective_from_ms === 'string' && /^\d+$/.test(value.effective_from_ms) &&
        typeof value.changed === 'boolean' && ['PENDING', 'DONE', 'NOT_REQUIRED'].includes(String(value.cache_state))
}
export function isUnconfirmedReceipt(error: unknown): boolean {
    return object(error) && error.error_code === 'RECEIPT_UNCONFIRMED' && error.operation_status === 'UNKNOWN'
}

export async function attemptPending(
    storage: PendingStorage,
    pending: PendingGridCommand,
    mode: 'save' | 'receipt' | 'recover',
    sender: (mode: 'save' | 'receipt', command: GridCommand) => Promise<unknown>
): Promise<{ status: 'success'; value: GridOperationResult } | { status: 'rejected'; error: unknown; journalCleared: boolean } | { status: 'unknown'; error: unknown }> {
    requireValid(same(readPending(storage), pending), 'PENDING_CHANGED')
    try {
        // Recovery reuses the save endpoint, but only a validated success may clear its journal.
        const value = await sender(mode === 'recover' ? 'save' : mode, structuredClone(pending.command))
        if (!operationResult(value, pending)) return { status: 'unknown', error: new Error('INVALID_RECEIPT') }
        if (same(readPending(storage), pending)) storage.removeItem(STORAGE_KEY)
        return { status: 'success', value }
    } catch (error) {
        const status = object(error) ? error.operation_status : undefined
        if (status === 'FAILED' && (mode === 'save' || (mode === 'recover' && object(error) && error.error_code === 'VERSION_CONFLICT'))) {
            const journalCleared = same(readPending(storage), pending)
            if (journalCleared) storage.removeItem(STORAGE_KEY)
            return { status: 'rejected', error, journalCleared }
        }
        return { status: 'unknown', error }
    }
}
export class SelectionGate {
    private generation = 0
    private controller?: AbortController
    next(key: string) {
        this.controller?.abort()
        const generation = ++this.generation
        const controller = new AbortController()
        this.controller = controller
        return { signal: controller.signal, current: (currentKey: string) => generation === this.generation && !controller.signal.aborted && currentKey === key }
    }
    close() {
        this.generation++
        this.controller?.abort()
    }
}
