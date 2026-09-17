import { App, Directive, ObjectDirective } from 'vue';
import { LoadingProps } from '../components/loading';
export type LoadingDirectiveValue = boolean | (LoadingProps & {
    visible?: boolean;
});
interface LoadingElement extends HTMLElement {
    __mmLoading?: LoadingDirectiveInstance;
}
interface LoadingDirectiveInstance {
    app: App;
    container: HTMLElement;
    originalPosition: string;
    state: Required<Pick<LoadingProps, 'backdrop' | 'fullscreen' | 'size' | 'visible'>> & Pick<LoadingProps, 'text'>;
    destroyed: boolean;
}
export declare const vMmLoading: ObjectDirective<LoadingElement, LoadingDirectiveValue>;
export declare const loadingDirective: Directive<HTMLElement, LoadingDirectiveValue>;
export {};
