export declare function createFileUid(prefix?: string): string;
export declare function acceptsFile(file: Pick<File, 'name' | 'type'>, accept?: string): boolean;
export declare function formatFileSize(bytes: number): string;
