import { PredictionConfiguration, PredictionEditModel, PredictionGameType } from './types';
export declare function createInitialModel(game: PredictionGameType, symbol: string, version: string): PredictionEditModel;
export declare function creationSnapshot(response: unknown, game: PredictionGameType, symbol: string): {
    version: string;
    existing: PredictionConfiguration | undefined;
};
