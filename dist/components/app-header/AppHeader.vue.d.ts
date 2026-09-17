import { AppHeaderAction, AppHeaderProfileItem, AppHeaderProps, AppHeaderTheme } from './types';
declare function toggleTheme(): void;
declare function handleAction(action: AppHeaderAction, event: MouseEvent): void;
declare var __VLS_1: {
    brand: import('./types').AppHeaderBrand | undefined;
    mobile: boolean;
    pageTitle: string;
}, __VLS_17: {
    contextActions: AppHeaderAction[];
    metrics: import('./types').AppHeaderMetric[];
    onAction: typeof handleAction;
}, __VLS_33: {
    identity: import('./types').AppHeaderIdentity | undefined;
    profile: import('./types').AppHeaderProfile | undefined;
    theme: AppHeaderTheme;
    toggleTheme: typeof toggleTheme;
}, __VLS_35: {
    identity: import('./types').AppHeaderIdentity | undefined;
}, __VLS_70: {
    theme: AppHeaderTheme;
    toggleTheme: typeof toggleTheme;
}, __VLS_72: {
    profile: import('./types').AppHeaderProfile | undefined;
};
type __VLS_Slots = {} & {
    brand?: (props: typeof __VLS_1) => any;
} & {
    center?: (props: typeof __VLS_17) => any;
} & {
    actions?: (props: typeof __VLS_33) => any;
} & {
    identity?: (props: typeof __VLS_35) => any;
} & {
    utilities?: (props: typeof __VLS_70) => any;
} & {
    profile?: (props: typeof __VLS_72) => any;
};
declare const __VLS_base: import('vue').DefineComponent<AppHeaderProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    action: (action: AppHeaderAction, event: MouseEvent) => any;
    "identity-click": (event: MouseEvent) => any;
    "profile-click": (event: MouseEvent) => any;
    "profile-select": (item: AppHeaderProfileItem) => any;
    "theme-change": (theme: AppHeaderTheme) => any;
    "toggle-mobile": (open: boolean) => any;
    "toggle-sidebar": (collapsed: boolean) => any;
    "update:mobileOpen": (open: boolean) => any;
    "update:sidebarCollapsed": (collapsed: boolean) => any;
    "update:theme": (theme: AppHeaderTheme) => any;
}, string, import('vue').PublicProps, Readonly<AppHeaderProps> & Readonly<{
    onAction?: ((action: AppHeaderAction, event: MouseEvent) => any) | undefined;
    "onIdentity-click"?: ((event: MouseEvent) => any) | undefined;
    "onProfile-click"?: ((event: MouseEvent) => any) | undefined;
    "onProfile-select"?: ((item: AppHeaderProfileItem) => any) | undefined;
    "onTheme-change"?: ((theme: AppHeaderTheme) => any) | undefined;
    "onToggle-mobile"?: ((open: boolean) => any) | undefined;
    "onToggle-sidebar"?: ((collapsed: boolean) => any) | undefined;
    "onUpdate:mobileOpen"?: ((open: boolean) => any) | undefined;
    "onUpdate:sidebarCollapsed"?: ((collapsed: boolean) => any) | undefined;
    "onUpdate:theme"?: ((theme: AppHeaderTheme) => any) | undefined;
}>, {
    display: import('./types').AppHeaderDisplay;
    contextActions: AppHeaderAction[];
    metrics: import('./types').AppHeaderMetric[];
    mobileBreakpoint: number;
    mobileOpen: boolean;
    pageTitle: string;
    showMobileToggle: boolean;
    showSidebarToggle: boolean;
    showThemeToggle: boolean;
    sidebarCollapsed: boolean;
    theme: AppHeaderTheme;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
