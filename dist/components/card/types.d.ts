export type CardShadow = 'always' | 'hover' | 'never';
export interface CardProps {
    bordered?: boolean;
    hoverable?: boolean;
    shadow?: CardShadow;
    subtitle?: string;
    title?: string;
}
