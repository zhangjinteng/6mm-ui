import { Ref } from 'vue';
import { ProTableColumn, QueryBarField, TableRow } from '../../../index';
export interface CmsSourceMetadata {
    cms_source_options?: {
        value: string;
        label: string;
    }[];
}
/** CMS ownership is independent from user-source snapshots and report scopes. */
export declare function createCmsSourceColumns<Row extends TableRow>(): ProTableColumn<Row>[];
export declare function useCmsSourceFields<T extends CmsSourceMetadata>(load: (signal?: AbortSignal, scope?: {
    cms_source_type?: string;
    cms_tenant_id?: string;
}) => Promise<T>, updateMetadata?: (metadata: T) => void): {
    fields: QueryBarField[];
    bindFilters: (_filters: Ref<Record<string, unknown>>) => void;
};
