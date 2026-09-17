import type { FormControlSize } from "../../shared/form";
import type { CursorPaginationProps } from "../cursor-pagination";
import type { PaginationSize } from "../pagination";
import type {
  QueryBarField,
  QueryBarReturnContext,
  QueryBarValue,
} from "../query-bar";
import type {
  TableColumn,
  TableKey,
  TableProps,
  TableRow,
  TableSortState,
} from "../table";

export interface ProTableColumn<
  Row extends TableRow = TableRow,
> extends TableColumn<Row> {
  defaultHidden?: boolean;
  hideable?: boolean;
}

export interface ProTablePaginationProps {
  currentPage?: number;
  disabled?: boolean;
  pageSize?: number;
  pageSizes?: number[];
  showJumper?: boolean;
  showSizeChanger?: boolean;
  size?: PaginationSize;
  total?: number;
}

export interface ProTableCursorPaginationProps extends Pick<
  CursorPaginationProps,
  "currentPage" | "disabled" | "hasMore" | "hasPrevious" | "loading" | "size"
> {
  pageSize?: number;
  rowCount?: number;
}

export interface ProTableProps<Row extends TableRow = TableRow> {
  ariaLabel?: string;
  autoRefreshOptions?: number[];
  autoRefreshSeconds?: number;
  blockingLoading?: boolean;
  bordered?: boolean;
  columns?: ProTableColumn<Row>[];
  columnsConfigurable?: boolean;
  currentPage?: number;
  data?: Row[];
  emptyText?: string;
  error?: string;
  fillHeight?: boolean;
  filterDrawer?: boolean;
  filterDrawerSubtitle?: string;
  filterDrawerTitle?: string;
  filters?: QueryBarValue;
  inlineQueryFieldKeys?: string[];
  lastUpdatedAt?: Date | string;
  loading?: boolean;
  maxHeight?: number | string;
  pageSize?: number;
  pageSizes?: number[];
  queryFields?: QueryBarField[];
  querySize?: FormControlSize;
  refreshable?: boolean;
  refreshing?: boolean;
  returnContext?: QueryBarReturnContext;
  rowDisabled?: TableProps<Row>["rowDisabled"];
  rowKey?: TableProps<Row>["rowKey"];
  selectable?: boolean;
  selectedRowKeys?: TableKey[];
  showCellTitle?: boolean;
  showPagination?: boolean;
  sort?: TableSortState;
  striped?: boolean;
  total?: number;
  visibleColumnKeys?: string[];
}
