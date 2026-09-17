export interface PageHeaderBreadcrumb {
    href?: string;
    label: string;
}
export interface PageHeaderProps {
    backLabel?: string;
    breadcrumbs?: PageHeaderBreadcrumb[];
    showBack?: boolean;
    subtitle?: string;
    title: string;
}
