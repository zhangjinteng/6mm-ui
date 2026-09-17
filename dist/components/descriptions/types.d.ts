import { InjectionKey } from 'vue';
export type DescriptionsDirection = 'horizontal' | 'vertical';
export type DescriptionsSize = 'lg' | 'md' | 'sm';
export interface DescriptionsProps {
    bordered?: boolean;
    column?: number;
    direction?: DescriptionsDirection;
    size?: DescriptionsSize;
    title?: string;
}
export interface DescriptionsItemProps {
    label?: string;
    span?: number;
}
export interface DescriptionsContext {
    bordered: boolean;
    column: number;
    direction: DescriptionsDirection;
}
export declare const descriptionsKey: InjectionKey<DescriptionsContext>;
