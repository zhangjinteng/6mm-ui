import type { Component } from "vue";

import { MmAlert } from "./alert";
import { MmAccountChangeLogTable } from "./account-change-log-table";
import { MmAdminLoginShell } from "./admin-login-shell";
import { MmAppHeader } from "./app-header";
import { MmAutocomplete } from "./autocomplete";
import { MmAvatar } from "./avatar";
import { MmBadge } from "./badge";
import { MmBorder } from "./border";
import { MmButton } from "./button";
import { MmCalendar } from "./calendar";
import { MmCard } from "./card";
import { MmCheckbox, MmCheckboxGroup } from "./checkbox";
import { MmCollapse, MmCollapseItem } from "./collapse";
import { MmColor } from "./color";
import { MmContainer } from "./container";
import { MmCursorPagination } from "./cursor-pagination";
import {
  MmConditionOrderTable,
  MmTpSlOrderTable,
} from "./condition-order-table";
import { MmCurrentOrderTable } from "./current-order-table";
import { MmDatePicker } from "./date-picker";
import { MmDatePickerPanel } from "./date-picker-panel";
import { MmDateRangePicker } from "./date-range-picker";
import { MmDescriptions, MmDescriptionsItem } from "./descriptions";
import { MmDivider } from "./divider";
import { MmDialog } from "./dialog";
import { MmDrawer } from "./drawer";
import { MmDropdown } from "./dropdown";
import { MmEmpty } from "./empty";
import { MmExchangeLogo } from "./exchange-logo";
import { MmFilterDrawer } from "./filter-drawer";
import { MmFeeCommissionTable } from "./fee-commission-table";
import { MmForm, MmFormItem } from "./form";
import { MmFundingAccountTable } from "./funding-account-table";
import { MmFundingChangeLogTable } from "./funding-change-log-table";
import { MmHistoryPositionTable } from "./history-position-table";
import { MmHistoryOrderTable } from "./history-order-table";
import { MmHandlingFeeConfig } from "./handling-fee-config";
import { MmHedgingExecutionTable } from "./hedging-execution-table";
import { MmHedgingMonitor } from "./hedging-monitor";
import { MmHedgingSymbolConfig } from "./hedging-symbol-config";
import { MmHedgingSubjectConfig } from "./hedging-subject-config";
import { MmIcon } from "./icon";
import { MmImage } from "./image";
import { MmInfoGrid, MmInfoGridItem } from "./info-grid";
import { MmIpLocation } from "./ip-location";
import { MmInput } from "./input";
import { MmInputNumber } from "./input-number";
import { MmLayout } from "./layout";
import { MmLink } from "./link";
import { MmLiquidationTable } from "./liquidation-table";
import { MmLiquidationTradesDialog } from "./liquidation-trades-dialog";
import { MmLoading } from "./loading";
import { MmMenu, MmMenuItem, MmSubMenu } from "./menu";
import { MmMessage } from "./message";
import { MmMessageBox } from "./message-box";
import { MmMarginChangeLogTable } from "./margin-change-log-table";
import { MmOnlineUserTable } from "./online-user-table";
import { MmPositionTable } from "./position-table";
import { MmUserDetailDialog } from "./user-detail-dialog";
import { MmUserAssetTable } from "./user-asset-table";
import { MmUserTable } from "./user-table";
import { MmPageHeader } from "./page-header";
import { MmPopover } from "./popover";
import { MmPagination } from "./pagination";
import { MmProgress } from "./progress";
import {
  MmProTable,
  MmProTableCursorPagination,
  MmProTablePagination,
} from "./pro-table";
import { MmQueryBar } from "./query-bar";
import { MmRadio, MmRadioGroup } from "./radio";
import { MmResult } from "./result";
import { MmScrollbar } from "./scrollbar";
import { MmSegmented } from "./segmented";
import { MmSelect } from "./select";
import { MmSidebarNav } from "./sidebar-nav";
import { MmSpace } from "./space";
import { MmStatistic } from "./statistic";
import { MmSymbolTagManager } from "./symbol-tag-manager";
import { MmSteps } from "./steps";
import { MmTable } from "./table";
import { MmTabPane, MmTabs } from "./tabs";
import { MmTag } from "./tag";
import { MmText } from "./text";
import { MmTooltip } from "./tooltip";
import { MmTradeFillTable } from "./trade-fill-table";
import { MmTypography } from "./typography";
import { MmUpload } from "./upload";

export * from "./alert";
export * from "./account-change-log-table";
export * from "./admin-login-shell";
export * from "./app-header";
export * from "./autocomplete";
export * from "./avatar";
export * from "./badge";
export * from "./border";
export * from "./button";
export * from "./calendar";
export * from "./card";
export * from "./checkbox";
export * from "./collapse";
export * from "./color";
export * from "./container";
export * from "./cursor-pagination";
export * from "./condition-order-table";
export * from "./current-order-table";
export * from "./date-picker";
export * from "./date-picker-panel";
export * from "./date-range-picker";
export * from "./descriptions";
export * from "./divider";
export * from "./dialog";
export * from "./drawer";
export * from "./dropdown";
export * from "./empty";
export * from "./exchange-logo";
export * from "./filter-drawer";
export * from "./fee-commission-table";
export * from "./form";
export * from "./funding-account-table";
export * from "./funding-change-log-table";
export * from "./history-position-table";
export * from "./history-order-table";
export * from "./handling-fee-config";
export * from "./hedging-execution-table";
export * from "./hedging-monitor";
export * from "./hedging-symbol-config";
export * from "./hedging-subject-config";
export * from "./icon";
export * from "./image";
export * from "./info-grid";
export * from "./ip-location";
export * from "./input";
export * from "./input-number";
export * from "./layout";
export * from "./link";
export * from "./liquidation-table";
export * from "./liquidation-trades-dialog";
export * from "./loading";
export * from "./menu";
export * from "./message";
export * from "./message-box";
export * from "./margin-change-log-table";
export * from "./online-user-table";
export * from "./position-table";
export * from "./user-detail-dialog";
export * from "./user-asset-table";
export * from "./user-table";
export * from "./page-header";
export * from "./popover";
export * from "./pagination";
export * from "./progress";
export * from "./pro-table";
export * from "./query-bar";
export * from "./radio";
export * from "./result";
export * from "./scrollbar";
export * from "./segmented";
export * from "./select";
export * from "./sidebar-nav";
export * from "./space";
export * from "./statistic";
export * from "./symbol-tag-manager";
export * from "./steps";
export * from "./table";
export * from "./tabs";
export * from "./tag";
export * from "./text";
export * from "./tooltip";
export * from "./trade-fill-table";
export * from "./typography";
export * from "./upload";

export type InstallableComponent = Component & { name?: string };

export const components: InstallableComponent[] = [
  MmAlert,
  MmAccountChangeLogTable,
  MmAdminLoginShell,
  MmAppHeader,
  MmAutocomplete,
  MmAvatar,
  MmBadge,
  MmBorder,
  MmButton,
  MmCalendar,
  MmCard,
  MmCheckbox,
  MmCheckboxGroup,
  MmCollapse,
  MmCollapseItem,
  MmColor,
  MmContainer,
  MmCursorPagination,
  MmConditionOrderTable,
  MmTpSlOrderTable,
  MmCurrentOrderTable,
  MmDatePicker,
  MmDatePickerPanel,
  MmDateRangePicker,
  MmDescriptions,
  MmDescriptionsItem,
  MmDivider,
  MmDialog,
  MmDrawer,
  MmDropdown,
  MmEmpty,
  MmExchangeLogo,
  MmFilterDrawer,
  MmFeeCommissionTable,
  MmForm,
  MmFormItem,
  MmFundingAccountTable,
  MmFundingChangeLogTable,
  MmHistoryPositionTable,
  MmHistoryOrderTable,
  MmHandlingFeeConfig,
  MmHedgingExecutionTable,
  MmHedgingMonitor,
  MmHedgingSymbolConfig,
  MmHedgingSubjectConfig,
  MmIcon,
  MmImage,
  MmInfoGrid,
  MmInfoGridItem,
  MmIpLocation,
  MmInput,
  MmInputNumber,
  MmLayout,
  MmLink,
  MmLiquidationTable,
  MmLiquidationTradesDialog,
  MmLoading,
  MmMenu,
  MmMenuItem,
  MmSubMenu,
  MmMessage,
  MmMessageBox,
  MmMarginChangeLogTable,
  MmOnlineUserTable,
  MmPositionTable,
  MmUserDetailDialog,
  MmUserAssetTable,
  MmUserTable,
  MmPageHeader,
  MmPopover,
  MmPagination,
  MmProgress,
  MmProTable,
  MmProTableCursorPagination,
  MmProTablePagination,
  MmQueryBar,
  MmRadio,
  MmRadioGroup,
  MmResult,
  MmScrollbar,
  MmSegmented,
  MmSelect,
  MmSidebarNav,
  MmSpace,
  MmStatistic,
  MmSymbolTagManager,
  MmSteps,
  MmTable,
  MmTabPane,
  MmTabs,
  MmTag,
  MmText,
  MmTooltip,
  MmTradeFillTable,
  MmTypography,
  MmUpload,
];
