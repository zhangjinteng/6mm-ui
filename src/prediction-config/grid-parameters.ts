/** Parameter provenance returned by the Grid v3 database contract. */
export interface GridParameterSource { kind: 'GLOBAL'; version: string; effective_from_ms: string }
export interface GridParameterMetadata {
    parameters_available: boolean
    parameter_source: 'GLOBAL' | 'SITE' | 'MERCHANT'
    stored_parameters: Record<'target_rtp' | 'min_multiplier' | 'max_multiplier' | 'min_order_amount' | 'max_order_amount', string | null>
    global_parameters_source: GridParameterSource | null
    default_parameter_source: 'GLOBAL' | 'SITE'
    default_global_parameters_source: GridParameterSource | null
    default_min_multiplier: string
    default_max_multiplier: string
}
export const gridParameterKeys = ['parameters_available', 'parameter_source', 'stored_parameters', 'global_parameters_source', 'default_parameter_source', 'default_global_parameters_source', 'default_min_multiplier', 'default_max_multiplier'] as const
const parameters = ['target_rtp','min_multiplier','max_multiplier','min_order_amount','max_order_amount'] as const
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
const ensure = (value: unknown): void => { if (!value) throw Error('INVALID_GRID_CONFIGURATION') }
const version = (v: unknown): v is string => typeof v === 'string' && /^[1-9][0-9]*$/.test(v) && (v.length<19 || (v.length===19 && v<='9223372036854775807'))
function source(v: unknown): GridParameterSource | null {
    if (v === null) return null
    ensure(object(v) && Object.keys(v).length===3 && v.kind==='GLOBAL' && version(v.version) && typeof v.effective_from_ms==='string' && /^[0-9]+$/.test(v.effective_from_ms))
    const row=v as GridParameterSource
    return {kind:'GLOBAL',version:row.version,effective_from_ms:row.effective_from_ms}
}
export function gridParameters(value: Record<string,unknown>, decimal: (v:unknown)=>string): GridParameterMetadata | undefined {
    if (!gridParameterKeys.some(key=>key in value)) return undefined
    ensure(gridParameterKeys.every(key=>key in value))
    if (value.parameters_available===false) throw Error('CONFIG_PARAMETERS_UNAVAILABLE')
    ensure(value.parameters_available===true && ['GLOBAL','SITE','MERCHANT'].includes(String(value.parameter_source)) && ['GLOBAL','SITE'].includes(String(value.default_parameter_source)))
    ensure(object(value.stored_parameters) && Object.keys(value.stored_parameters).length===5 && parameters.every(k=>k in (value.stored_parameters as object)))
    const stored=value.stored_parameters as Record<string,unknown>
    const group=Object.fromEntries(parameters.map(key=>[key,stored[key]===null ? null : decimal(stored[key])])) as GridParameterMetadata['stored_parameters']
    ensure(Object.values(group).every(v=>value.parameter_source==='GLOBAL' ? v===null : v!==null))
    const global=source(value.global_parameters_source),parent=source(value.default_global_parameters_source)
    ensure((value.parameter_source==='GLOBAL')===(global!==null) && (value.default_parameter_source==='GLOBAL')===(parent!==null))
    ensure(!global || !parent || global.version===parent.version)
    return {parameters_available:true,parameter_source:value.parameter_source as GridParameterMetadata['parameter_source'],stored_parameters:group,global_parameters_source:global,default_parameter_source:value.default_parameter_source as GridParameterMetadata['default_parameter_source'],default_global_parameters_source:parent,default_min_multiplier:decimal(value.default_min_multiplier),default_max_multiplier:decimal(value.default_max_multiplier)}
}
export function gridGlobalVersion(value: Partial<GridParameterMetadata>): string | undefined {
    return value.global_parameters_source?.version ?? value.default_global_parameters_source?.version
}
