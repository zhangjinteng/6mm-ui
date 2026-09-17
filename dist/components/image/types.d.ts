export type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export interface ImageProps {
    alt?: string;
    fit?: ImageFit;
    height?: number | string;
    lazy?: boolean;
    preview?: boolean;
    previewSrcList?: string[];
    src: string;
    width?: number | string;
}
export interface ImageExpose {
    closePreview: () => void;
    openPreview: () => void;
}
