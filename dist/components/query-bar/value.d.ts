import { QueryBarField, QueryBarFieldValue, QueryBarValue } from './types';
export declare function cloneQueryBarFieldValue(value: QueryBarFieldValue): QueryBarFieldValue;
export declare function cloneQueryBarValue(value: QueryBarValue): QueryBarValue;
export declare function queryBarFieldDefault(field: QueryBarField): QueryBarFieldValue;
export declare function createQueryBarValue(fields: QueryBarField[]): QueryBarValue;
export declare function materializeQueryBarValue(value: QueryBarValue, fields: QueryBarField[]): QueryBarValue;
