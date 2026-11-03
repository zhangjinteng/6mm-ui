/** Parameter provenance returned by the Grid v3 database contract. */
export interface GridParameterSource {
    kind: 'GLOBAL';
    version: string;
    effective_from_ms: string;
}
export interface GridParameterMetadata {
    parameters_available: boolean;
    parameter_source: 'GLOBAL' | 'SITE' | 'MERCHANT';
    stored_parameters: Record<'target_rtp' | 'min_multiplier' | 'max_multiplier' | 'min_order_amount' | 'max_order_amount', string | null>;
    global_parameters_source: GridParameterSource | null;
    default_parameter_source: 'GLOBAL' | 'SITE';
    default_global_parameters_source: GridParameterSource | null;
    default_min_multiplier: string;
    default_max_multiplier: string;
}
export declare const gridParameterKeys: readonly ["parameters_available", "parameter_source", "stored_parameters", "global_parameters_source", "default_parameter_source", "default_global_parameters_source", "default_min_multiplier", "default_max_multiplier"];
export declare function gridParameters(value: Record<string, unknown>, decimal: (v: unknown) => string): GridParameterMetadata | undefined;
export declare function gridGlobalVersion(value: Partial<GridParameterMetadata>): string | undefined;
