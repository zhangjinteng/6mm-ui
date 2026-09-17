export type LayoutAlign = 'baseline' | 'center' | 'end' | 'start' | 'stretch';
export type LayoutDirection = 'column' | 'column-reverse' | 'row' | 'row-reverse';
export type LayoutJustify = 'around' | 'between' | 'center' | 'end' | 'evenly' | 'start';
export interface LayoutProps {
    align?: LayoutAlign;
    as?: string;
    direction?: LayoutDirection;
    gap?: number | string;
    inline?: boolean;
    justify?: LayoutJustify;
    wrap?: boolean;
}
