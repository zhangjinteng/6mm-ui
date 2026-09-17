import { App } from 'vue';
import { MmUILocaleSource } from './composables/use-locale';
export interface MmUIThemeColors {
    danger?: string;
    dangerSoft?: string;
    info?: string;
    infoSoft?: string;
    onPrimary?: string;
    primary?: string;
    primaryHover?: string;
    primarySoft?: string;
    success?: string;
    successSoft?: string;
    warning?: string;
    warningSoft?: string;
}
export interface MmUITheme extends MmUIThemeColors {
    dark?: MmUIThemeColors;
    light?: MmUIThemeColors;
}
export interface MmUIOptions {
    locale?: MmUILocaleSource;
    theme?: MmUITheme;
}
export interface MmUIPlugin {
    install: (app: App, options?: MmUIOptions) => void;
}
export declare function install(app: App, options?: MmUIOptions): void;
declare const MmUI: MmUIPlugin;
export default MmUI;
