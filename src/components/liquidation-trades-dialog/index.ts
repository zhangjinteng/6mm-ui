import type { App } from 'vue'

import LiquidationTradesDialog from './LiquidationTradesDialog.vue'

export const MmLiquidationTradesDialog = Object.assign(LiquidationTradesDialog, {
  install(app: App) {
    app.component('MmLiquidationTradesDialog', LiquidationTradesDialog)
  },
})

export default MmLiquidationTradesDialog
export * from './types'
