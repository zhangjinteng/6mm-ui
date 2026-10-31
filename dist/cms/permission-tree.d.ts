export type CmsMenuId = string | number;
export interface CmsPermissionNode {
    id: CmsMenuId;
    name?: string;
    type?: string;
    perms?: string;
    children?: CmsPermissionNode[];
}
/** CMS list access remains selectable even when a page has write-action children. */
export declare function cmsPermissionItems(node: CmsPermissionNode, name: (node: CmsPermissionNode) => string, parentPage?: string, depth?: number): {
    id: CmsMenuId;
    name: string;
}[];
/** Action selection implies ancestors; selecting list access never grants its actions. */
export declare function cmsPermissionSubmission(nodes: CmsPermissionNode[], selectedIds: CmsMenuId[]): CmsMenuId[];
