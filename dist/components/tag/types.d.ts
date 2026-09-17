export type TagEffect = 'outline' | 'soft' | 'solid';
export type TagSize = 'lg' | 'md' | 'sm';
export type TagType = 'danger' | 'default' | 'info' | 'primary' | 'success' | 'warning';
export interface TagProps {
    closable?: boolean;
    disabled?: boolean;
    effect?: TagEffect;
    round?: boolean;
    size?: TagSize;
    type?: TagType;
}
