import { ComputedRef, InjectionKey } from 'vue';
export type TabsDirection = 'horizontal' | 'vertical';
export type TabsType = 'card' | 'line';
export type TabsValue = string | number;
export interface TabsProps {
    direction?: TabsDirection;
    lazy?: boolean;
    modelValue?: TabsValue;
    type?: TabsType;
}
export interface TabPaneProps {
    disabled?: boolean;
    forceRender?: boolean;
    label: string;
    lazy?: boolean;
    name: TabsValue;
}
export interface TabRecord {
    disabled: ComputedRef<boolean>;
    label: ComputedRef<string>;
    name: TabsValue;
    panelId: string;
    tabId: string;
}
export interface TabsContext {
    activeValue: ComputedRef<TabsValue | undefined>;
    isLazy: ComputedRef<boolean>;
    register: (record: TabRecord) => void;
    unregister: (name: TabsValue) => void;
}
export declare const tabsKey: InjectionKey<TabsContext>;
