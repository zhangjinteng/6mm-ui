import { MessageBoxAction, MessageBoxProps } from './types';
declare const __VLS_export: import('vue').DefineComponent<MessageBoxProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => any;
    action: (action: MessageBoxAction, value: string) => any;
    "update:inputValue": (value: string) => any;
}, string, import('vue').PublicProps, Readonly<MessageBoxProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onAction?: ((action: MessageBoxAction, value: string) => any) | undefined;
    "onUpdate:inputValue"?: ((value: string) => any) | undefined;
}>, {
    type: import('./types').MessageBoxType;
    modelValue: boolean;
    closeOnEscape: boolean;
    message: string;
    closeOnClickModal: boolean;
    inputValidator: import('./types').MessageBoxInputValidator;
    inputValue: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
