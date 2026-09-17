export type BadgeType = 'danger' | 'info' | 'primary' | 'success' | 'warning';
export interface BadgeProps {
    ariaLabel?: string;
    dot?: boolean;
    hidden?: boolean;
    max?: number;
    showZero?: boolean;
    type?: BadgeType;
    value?: number | string;
}
