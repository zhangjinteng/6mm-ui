import type { ProTableColumn } from "../pro-table";
import type { QueryBarField, QueryBarValue } from "../query-bar";
import type { SelectOption } from "../select";
import type { TableRow } from "../table";

export interface HandlingFeeConfigRow extends TableRow {
  agent_id: number | string;
  id: number | string;
  level: number | string;
  level_name: string;
  maker_fee_rate: number | string;
  taker_fee_rate: number | string;
  volume_30d: number | string;
  volume_30d_min?: number | string | null;
}

export interface HandlingFeeConfigListQuery {
  agent_id: number;
  page_no: number;
  page_size: number;
}

export interface HandlingFeeConfigListResult<
  Row extends HandlingFeeConfigRow = HandlingFeeConfigRow,
> {
  rows: Row[];
  total: number;
  updatedAt?: Date | string;
}

export interface HandlingFeeConfigRequestContext {
  filters: QueryBarValue;
  signal: AbortSignal;
}

export type HandlingFeeConfigListRequest<
  Row extends HandlingFeeConfigRow = HandlingFeeConfigRow,
> = (
  query: HandlingFeeConfigListQuery,
  context: HandlingFeeConfigRequestContext,
) => Promise<HandlingFeeConfigListResult<Row>>;

export interface HandlingFeeConfigFormValue {
  agent_id: number;
  id?: number | string;
  level_name: string;
  maker_fee_rate: string;
  taker_fee_rate: string;
  volume_30d: string;
  volume_30d_min?: string;
}

export type HandlingFeeConfigCreateDefaults =
  Partial<HandlingFeeConfigFormValue>;

export interface HandlingFeeConfigActionContext {
  reload: () => Promise<void>;
}

export interface HandlingFeeConfigActions<
  Row extends HandlingFeeConfigRow = HandlingFeeConfigRow,
> {
  create?: (
    value: HandlingFeeConfigFormValue,
    context: HandlingFeeConfigActionContext,
  ) => Promise<unknown> | unknown;
  loadCreateDefaults?: () =>
    Promise<HandlingFeeConfigCreateDefaults> | HandlingFeeConfigCreateDefaults;
  loadEditData?: (
    row: Row,
  ) =>
    | Promise<Partial<HandlingFeeConfigFormValue>>
    | Partial<HandlingFeeConfigFormValue>;
  remove?: (
    row: Row,
    context: HandlingFeeConfigActionContext,
  ) => Promise<unknown> | unknown;
  update?: (
    row: Row,
    value: HandlingFeeConfigFormValue,
    context: HandlingFeeConfigActionContext,
  ) => Promise<unknown> | unknown;
}

export type HandlingFeeConfigColumns<
  Row extends HandlingFeeConfigRow = HandlingFeeConfigRow,
> =
  | ProTableColumn<Row>[]
  | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[]);

export type HandlingFeeConfigQueryFields =
  QueryBarField[] | ((defaultFields: QueryBarField[]) => QueryBarField[]);

export interface HandlingFeeConfigProps<
  Row extends HandlingFeeConfigRow = HandlingFeeConfigRow,
> {
  actions?: HandlingFeeConfigActions<Row>;
  ariaLabel?: string;
  canEditRow?: (row: Row) => boolean;
  columns?: HandlingFeeConfigColumns<Row>;
  columnsConfigurable?: boolean;
  fillHeight?: boolean;
  initialAgentId?: number | string;
  initialPageSize?: number;
  ownerOptions?: SelectOption[];
  pageSizes?: number[];
  platformAgentId?: number;
  queryFields?: HandlingFeeConfigQueryFields;
  request: HandlingFeeConfigListRequest<Row>;
  showOwnerFilter?: boolean;
  volumeEditable?: boolean;
  writeAgentId?: number | string;
}

export interface HandlingFeeConfigExpose {
  reload: () => Promise<void>;
}

export type HandlingFeeConfigActionName =
  "create" | "delete" | "load-create" | "load-edit" | "update";
