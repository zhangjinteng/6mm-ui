export type CssVarValue = string | number | undefined;
export type CssVarRecord = Record<string, CssVarValue>;
export declare function useNamespace(block: string): {
    b: (blockSuffix?: string) => string;
    be: (blockSuffix?: string, element?: string) => string;
    bem: (blockSuffix?: string, element?: string, modifier?: string) => string;
    bm: (blockSuffix?: string, modifier?: string) => string;
    cssVar: (values: CssVarRecord) => Record<string, string | number>;
    cssVarName: (...names: string[]) => string;
    e: (element?: string) => string;
    em: (element?: string, modifier?: string) => string;
    is: (name: string, state?: boolean) => string;
    m: (modifier?: string) => string;
};
export type Namespace = ReturnType<typeof useNamespace>;
