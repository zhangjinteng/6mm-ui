export type ColorContrast = 'auto' | 'dark' | 'light';
export type ColorSize = 'lg' | 'md' | 'sm';
export interface ColorProps {
    contrast?: ColorContrast;
    label?: string;
    selectable?: boolean;
    showValue?: boolean;
    size?: ColorSize;
    value: string;
}
