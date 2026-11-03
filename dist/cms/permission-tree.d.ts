export type CmsMenuId = string | number;
export interface CmsPermissionNode {
    id: CmsMenuId;
    name?: string;
    type?: string;
    perms?: string;
    children?: CmsPermissionNode[];
}
/** CMS / white-label settings list access remains selectable beside write actions. */
export declare function cmsPermissionItems(node: CmsPermissionNode, name: (node: CmsPermissionNode) => string, parentPage?: string, depth?: number): {
    id: CmsMenuId;
    name: string;
}[];
/** Action selection implies ancestors; selecting list access never grants its actions. */
export declare function cmsPermissionSubmission(nodes: CmsPermissionNode[], selectedIds: CmsMenuId[]): CmsMenuId[];
