import { createApp } from "vue";

import MmUI from "../src";
import App from "./App.vue";
import ComponentInfoPage from "./ComponentInfoPage.vue";
import FuturesTradeReportPreviewPage from "./FuturesTradeReportPreviewPage.vue";
import HandlingFeeConfigPreview from "./HandlingFeeConfigPreview.vue";
import ProTablePreviewPage from "./ProTablePreviewPage.vue";
import SidebarNavPreviewPage from "./SidebarNavPreviewPage.vue";
import RichTextEditorPreview from "./RichTextEditorPreview.vue";
import CmsViewportPreview from "./CmsViewportPreview.vue";

const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
const RootView =
  normalizedPath === "/cms-viewport" ? CmsViewportPreview :
  normalizedPath === "/rich-text-editor"
    ? RichTextEditorPreview
    : normalizedPath === "/component-info"
    ? ComponentInfoPage
    : normalizedPath === "/handling-fee-config"
      ? HandlingFeeConfigPreview
      : normalizedPath === "/pro-table"
        ? ProTablePreviewPage
        : normalizedPath === "/futures-trade-report"
          ? FuturesTradeReportPreviewPage
          : normalizedPath === "/sidebar-nav"
            ? SidebarNavPreviewPage
            : App;

createApp(RootView).use(MmUI).mount("#app");
