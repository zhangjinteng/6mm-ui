type Room = {
    key: string;
    label: string;
    present: boolean;
    allowed: boolean;
};
type __VLS_Props = {
    rooms: Room[];
    selected: string;
    disabled: boolean;
    context: string;
    description?: string;
};
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (key: string, present: boolean) => any;
    select: (key: string) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((key: string, present: boolean) => any) | undefined;
    onSelect?: ((key: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
