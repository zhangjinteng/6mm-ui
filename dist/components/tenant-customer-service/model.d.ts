export interface TenantCustomerOperation {
    status: 'inflight' | 'pending' | 'confirmed' | 'failed';
    enabled: boolean;
    message: string;
    attempts: number;
    retry_after: number | null;
    can_retry: boolean;
}
export interface TenantCustomerServiceDetail {
    site_id: string;
    config_version: string;
    entitlement_version: string;
    enabled: boolean;
    binding_status: string;
    operation: TenantCustomerOperation | null;
    service_ready: boolean;
    updated_at: string | null;
    can_edit?: boolean;
}
export interface TenantCustomerServiceToggleInput {
    site_id: string;
    expected_config_version: string;
    expected_entitlement_version: string;
    enabled: boolean;
    client_timezone: string;
}
export interface TenantCustomerServiceTransport {
    load: (signal: AbortSignal) => Promise<TenantCustomerServiceDetail>;
    toggle: (input: TenantCustomerServiceToggleInput) => Promise<{
        changed: boolean;
        detail: TenantCustomerServiceDetail;
    }>;
}
