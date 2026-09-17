export type ContainerSize = 'full' | 'lg' | 'md' | 'sm' | 'xl';
export interface ContainerProps {
    as?: string;
    centered?: boolean;
    fluid?: boolean;
    gutter?: number | string;
    padded?: boolean;
    size?: ContainerSize;
}
