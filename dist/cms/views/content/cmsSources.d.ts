import { ProTableColumn, QueryBarField, TableRow, UseMmProTableReturn } from '../../../index';
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
    fields: import('vue').Reactive<QueryBarField[]>;
    bindTable: <Row extends TableRow>(table: UseMmProTableReturn<Row>) => UseMmProTableReturn<Row>;
    loadMetadata: () => Promise<void>;
};
