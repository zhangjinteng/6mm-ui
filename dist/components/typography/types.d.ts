export type TypographyAlign = 'center' | 'left' | 'right';
export type TypographyDensity = 'compact' | 'default' | 'relaxed';
export type TypographyLevel = 1 | 2 | 3 | 4 | 5 | 6;
export interface TypographyProps {
    align?: TypographyAlign;
    as?: string;
    collapsedLines?: number;
    collapsible?: boolean;
    copyText?: string;
    copyable?: boolean;
    defaultExpanded?: boolean;
    density?: TypographyDensity;
    expanded?: boolean;
    level?: TypographyLevel;
    title?: string;
}
