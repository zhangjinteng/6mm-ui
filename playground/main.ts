import { createApp } from "vue";

import MmUI from "../src";
import App from "./App.vue";
import ComponentInfoPage from "./ComponentInfoPage.vue";
import HandlingFeeConfigPreview from "./HandlingFeeConfigPreview.vue";
import ProTablePreviewPage from "./ProTablePreviewPage.vue";
import SidebarNavPreviewPage from "./SidebarNavPreviewPage.vue";

const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
const RootView =
  normalizedPath === "/component-info"
    ? ComponentInfoPage
    : normalizedPath === "/handling-fee-config"
      ? HandlingFeeConfigPreview
      : normalizedPath === "/pro-table"
        ? ProTablePreviewPage
        : normalizedPath === "/sidebar-nav"
          ? SidebarNavPreviewPage
          : App;

createApp(RootView).use(MmUI).mount("#app");
