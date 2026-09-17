export type DividerAlign = 'center' | 'end' | 'start';
export type DividerDirection = 'horizontal' | 'vertical';
export interface DividerProps {
    align?: DividerAlign;
    color?: string;
    dashed?: boolean;
    direction?: DividerDirection;
    label?: string;
    margin?: number | string;
}
