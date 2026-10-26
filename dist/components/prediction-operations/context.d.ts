import { Component } from 'vue';
export interface PresentationContext {
    symbolComponent?: Component;
    showSources: boolean;
    locale?: string;
}
export declare const providePresentation: (value: () => PresentationContext) => void;
export declare const usePresentation: () => () => PresentationContext;
