import { afterEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Dialog from '../UserPortraitDialog.vue'
import type { UserPortrait } from '../types'

afterEach(() => { document.body.innerHTML = '' })
const snapshot = (id: number): UserPortrait => ({
  detail: { user_id: id, public_user_id: 91000 + id, username: 'profile-' + id },
  account: {wallet_balance: '421.25'}, positions: [], orders: null, volume_30d: '32', realized_pnl: '-2',
})

it('uses the exact selected UID for lazy tables and never renders privileged actions by default', async () => {
  const position = vi.fn(async () => ({rows: [], total: 0}))
  const wrapper = mount(Dialog, {props: {
    modelValue: true, subject: 1, request: async () => snapshot(1), tables: {position}, marketPrices: {},
  }})
  await flushPromises()
  expect(document.body.textContent).toContain('421.25')
  expect(document.body.textContent).not.toContain('重置密码')
  expect(document.body.textContent).not.toContain('资金流水')
  expect(position).not.toHaveBeenCalled()
  const tab = Array.from(document.body.querySelectorAll<HTMLElement>('[role="menuitem"]')).find(el => el.textContent?.includes('当前仓位'))
  expect(tab).toBeDefined()
  tab!.click()
  await flushPromises()
  expect(position).toHaveBeenCalledWith(expect.objectContaining({keyword:'uid:91001'}), expect.anything())
  wrapper.unmount()
})

it('does not show a late response for the previously selected user', async () => {
  let finish!: (data: UserPortrait) => void
  const wrapper = mount(Dialog, {props: {
    modelValue:true, subject:1, tables:{}, marketPrices:{},
    request: async (id: number | string) => id === 1 ? new Promise<UserPortrait>(resolve => {finish = resolve}) : snapshot(2),
  }})
  await wrapper.setProps({subject:2})
  await flushPromises()
  finish(snapshot(1))
  await flushPromises()
  expect(document.body.textContent).toContain('profile-2')
  expect(document.body.textContent).not.toContain('profile-1')
  wrapper.unmount()
})
