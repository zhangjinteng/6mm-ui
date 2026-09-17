import { InjectionKey, Ref } from 'vue';
export type InfoGridSize = "sm" | "md" | "lg";
export interface InfoGridProps {
    columns?: number;
    size?: InfoGridSize;
}
export interface InfoGridItemProps {
    label?: string;
    span?: number;
    valueClass?: string;
}
export interface InfoGridContext {
    columns: Readonly<Ref<number>>;
}
export declare const infoGridKey: InjectionKey<InfoGridContext>;
