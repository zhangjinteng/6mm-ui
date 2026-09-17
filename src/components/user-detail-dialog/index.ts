import type { App } from 'vue'

import UserDetailDialog from './UserDetailDialog.vue'

export const MmUserDetailDialog = Object.assign(UserDetailDialog, {
  install(app: App) {
    app.component('MmUserDetailDialog', UserDetailDialog)
  },
})

export default MmUserDetailDialog
export * from './types'
