import { RichTextEditorExpose, RichTextEditorProps, RichTextEditorValue } from './types';
declare var __VLS_13: {
    editor: import('@tiptap/vue-3').Editor | undefined;
    disabled: boolean;
}, __VLS_25: {
    editor: import('@tiptap/vue-3').Editor | undefined;
    characters: number;
};
type __VLS_Slots = {} & {
    'toolbar-end'?: (props: typeof __VLS_13) => any;
} & {
    footer?: (props: typeof __VLS_25) => any;
};
declare const __VLS_base: import('vue').DefineComponent<RichTextEditorProps, RichTextEditorExpose, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    blur: (event: FocusEvent) => any;
    change: (html: string) => any;
    focus: (event: FocusEvent) => any;
    "update:modelValue": (html: string) => any;
    update: (value: RichTextEditorValue) => any;
}, string, import('vue').PublicProps, Readonly<RichTextEditorProps> & Readonly<{
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onChange?: ((html: string) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((html: string) => any) | undefined;
    onUpdate?: ((value: RichTextEditorValue) => any) | undefined;
}>, {
    disabled: boolean;
    modelValue: string | null;
    readonly: boolean;
    showCount: boolean;
    toolbar: boolean;
    minHeight: number | string;
    extensions: import('@tiptap/core').Extensions;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
