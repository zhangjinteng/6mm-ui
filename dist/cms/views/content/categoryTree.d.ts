import { Ref } from 'vue';
export declare function loadCategoryPages<T>(page: (n: number, size: number) => Promise<{
    lists: T[];
    count: number;
}>, signal: AbortSignal): Promise<{
    rows: T[];
    total: number;
}>;
export declare function useCategoryTree<T extends {
    id: string;
    parent_id?: unknown;
}>(rows: Ref<T[]>): {
    visibleRows: import('vue').ComputedRef<T[]>;
    expanded: Ref<Set<string> & Omit<Set<string>, keyof Set<any>>, Set<string> | (Set<string> & Omit<Set<string>, keyof Set<any>>)>;
    groups: import('vue').ComputedRef<{
        roots: T[];
        children: Map<string, T[]>;
    }>;
    allExpanded: import('vue').ComputedRef<boolean>;
    toggle: (id: string) => void;
    toggleAll: () => void;
};
