import { SiteGame } from '../../../api/prediction/site-types';
export declare function publicSymbols(value: unknown, game: SiteGame): string[];
export declare function symbolDirectory(allowed: string[], configured: string[], common: string[], enabled?: string[]): {
    symbol: string;
    allowed: boolean;
    publicConfigured: boolean;
}[];
