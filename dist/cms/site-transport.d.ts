import { CmsRequest, CmsRuntime, CmsSiteContext } from './runtime';
/** One page/site generation. Initial concurrent reads may bind it once, never retarget it. */
export declare function createCmsSiteTransport(runtime: CmsRuntime, onContext: (context: CmsSiteContext) => void, initialSpace?: string | null): {
    request: CmsRequest;
    invalidate: () => void;
};
