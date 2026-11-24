import { afterEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Actions from './UserPortraitActions.vue'
import Balance from './UserBalanceDialog.vue'
import Password from './UserResetPasswordDialog.vue'
import type { BalanceAdjustmentParams } from './types'

afterEach(() => { document.body.innerHTML = ''; sessionStorage.clear() })
const button = (text: string) => Array.from(document.body.querySelectorAll('button')).find(el => el.textContent?.includes(text))!
const savedParams = { user_id: '900001', balance: '1', reason: 'original', out_request_no: '123456789012345678' }
const savedKey = 'manual-user-adjustment:test:query:900001'
function savePending() { sessionStorage.setItem(savedKey, JSON.stringify({ ...savedParams, direction: 'inc' })) }
async function fill(selector: string, value: string) {
  const input = document.body.querySelector<HTMLInputElement>(selector)!
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
  await flushPromises()
}

it('retains the platform buttons and enforces the three separate permissions', async () => {
  const w = mount(Actions, { props: { canIncrease: false, canDecrease: true, canResetPassword: false } })
  expect(w.find('[data-user-profile-action="balance-increase"]').exists()).toBe(false)
  expect(w.get('[data-user-profile-action="reset-password"]').attributes('disabled')).toBeDefined()
  await w.get('[data-user-profile-action="balance-decrease"]').trigger('click')
  expect(w.emitted('decrease')).toHaveLength(1)
  w.unmount()
})

it('uses the platform balance preview and passes decimal strings without a merchant debit', async () => {
  const adjust = vi.fn(async () => ({}))
  const w = mount(Balance, { props: { adjust, storageScope: 'test:1' } })
  w.vm.open('900001', 'inc', '100.00', { uid: '900001', username: 'test' })
  await flushPromises()
  expect(document.body.textContent).toContain('当前账户余额(U)')
  expect(document.body.textContent).toContain('预计调整后(U)')
  expect(document.body.textContent).not.toContain('白标余额')
  await fill('input', '0.12345678')
  await fill('textarea', 'fixture reason')
  button('提交调账').click()
  await flushPromises()
  expect(adjust).toHaveBeenCalledOnce()
  expect(adjust.mock.calls[0]).toEqual(['inc', expect.objectContaining({ user_id: '900001', balance: '0.12345678', reason: 'fixture reason' })])
  expect(w.emitted('success')).toHaveLength(1)
  expect(sessionStorage.length).toBe(0)
  w.unmount()
})

it('restores the same pending contract request after closing and reopening', async () => {
  const adjust = vi.fn().mockRejectedValue(Object.assign(new Error('unknown'), { status: 'pending' }))
  const w = mount(Balance, { props: { adjust, storageScope: 'test:2' } })
  w.vm.open('900001', 'dec', '100')
  await flushPromises()
  await fill('input', '10.01')
  await fill('textarea', 'test deduction')
  button('提交调账').click()
  await flushPromises()
  const original = adjust.mock.calls[0][1]
  expect(document.body.textContent).toContain('待确认')
  w.unmount()
  document.body.innerHTML = ''
  const reopened = mount(Balance, { props: { adjust, storageScope: 'test:2' } })
  reopened.vm.open('900001', 'inc', '100')
  await flushPromises()
  button('查询结果').click()
  await flushPromises()
  expect(adjust.mock.calls[1]).toEqual(['dec', original])
  expect(document.body.querySelector('textarea')?.disabled).toBe(true)
  reopened.unmount()
})

it('does not submit zero amounts or blank reasons', async () => {
  const adjust = vi.fn()
  const w = mount(Balance, { props: { adjust } })
  w.vm.open(1, 'inc', 0)
  await flushPromises()
  await fill('input', '0')
  await fill('textarea', '   ')
  button('提交调账').click()
  await flushPromises()
  expect(adjust).not.toHaveBeenCalled()
  w.unmount()
})

it.each(['success', 'failed'] as const)('queries on open and clears only confirmed %s after refreshing balance', async (status) => {
  savePending()
  const adjust = vi.fn(async (_direction: 'inc' | 'dec', _params: BalanceAdjustmentParams) => ({}))
  const queryAdjustment = vi.fn(async () => ({ status, balance: '25.00' }))
  const w = mount(Balance, { props: { adjust, queryAdjustment, storageScope: 'test:query' } })
  w.vm.open('900001', 'dec', '0')
  await flushPromises()
  expect(queryAdjustment).toHaveBeenCalledWith('inc', savedParams)
  expect(adjust).not.toHaveBeenCalled()
  expect(sessionStorage.getItem(savedKey)).toBeNull()
  expect(document.body.textContent).toContain('25.00')
  expect(document.body.querySelector('textarea')?.disabled).toBe(false)
  expect(document.body.querySelector('input')?.value).toBe('')
  expect(w.emitted('reconciled')?.[0]).toEqual([status])
  await fill('input', '2')
  await fill('textarea', 'new manual request')
  button('提交调账').click()
  await flushPromises()
  expect(adjust).toHaveBeenCalledOnce()
  expect(adjust.mock.calls[0][0]).toBe('dec')
  expect(adjust.mock.calls[0][1].out_request_no).not.toBe(savedParams.out_request_no)
  w.unmount()
})

it.each(['pending', 'unknown', 'error', 'missing-balance'] as const)('keeps the original request locked for %s and retries only the query', async (state) => {
  savePending()
  const adjust = vi.fn()
  const queryAdjustment = vi.fn(async () => {
    if (state === 'error') throw new Error('unavailable')
    return { status: state === 'missing-balance' ? 'success' as const : state }
  })
  const w = mount(Balance, { props: { adjust, queryAdjustment, storageScope: 'test:query' } })
  w.vm.open('900001')
  await flushPromises()
  expect(sessionStorage.getItem(savedKey)).not.toBeNull()
  expect(document.body.querySelector('textarea')?.disabled).toBe(true)
  button('查询结果').click()
  await flushPromises()
  expect(queryAdjustment).toHaveBeenCalledTimes(2)
  expect(queryAdjustment).toHaveBeenLastCalledWith('inc', savedParams)
  expect(adjust).not.toHaveBeenCalled()
  w.unmount()
})

it('ignores a late response after switching users and never clears the old cache', async () => {
  savePending()
  let resolve!: (result: { status: 'success'; balance: string }) => void
  const queryAdjustment = vi.fn(() => new Promise<{ status: 'success'; balance: string }>(done => { resolve = done }))
  const adjust = vi.fn()
  const w = mount(Balance, { props: { adjust, queryAdjustment, storageScope: 'test:query' } })
  w.vm.open('900001')
  await flushPromises()
  expect(button('查询结果').disabled).toBe(true)
  w.vm.open('900002', 'inc', '99')
  resolve({ status: 'success', balance: '1' })
  await flushPromises()
  expect(sessionStorage.getItem(savedKey)).not.toBeNull()
  expect(document.body.textContent).toContain('99.00')
  expect(w.emitted('reconciled')).toBeUndefined()
  expect(adjust).not.toHaveBeenCalled()
  w.unmount()
})

it('ignores a query response after closing the dialog', async () => {
  savePending()
  let resolve!: (result: { status: 'success'; balance: string }) => void
  const queryAdjustment = vi.fn(() => new Promise<{ status: 'success'; balance: string }>(done => { resolve = done }))
  const adjust = vi.fn()
  const w = mount(Balance, { props: { adjust, queryAdjustment, storageScope: 'test:query' } })
  w.vm.open('900001')
  await flushPromises()
  button('取消').click()
  resolve({ status: 'success', balance: '1' })
  await flushPromises()
  expect(sessionStorage.getItem(savedKey)).not.toBeNull()
  expect(w.emitted('reconciled')).toBeUndefined()
  expect(adjust).not.toHaveBeenCalled()
  w.unmount()
})

it('uses the platform password confirmation with a required reason and the selected user', async () => {
  const resetPassword = vi.fn(async () => ({ password: 'fixture-password' }))
  const w = mount(Password, { props: { resetPassword } })
  w.vm.open({ user_id: '900001', public_user_id: '900001', source_type: 'white_label', source_name: 'test site' })
  await flushPromises()
  expect(document.body.textContent).toContain('白标 · test site')
  expect(button('确认重置用户密码').disabled).toBe(true)
  await fill('textarea', '  support request  ')
  button('确认重置用户密码').click()
  await flushPromises()
  expect(resetPassword).toHaveBeenCalledWith({ user_id: '900001', reason: 'support request' })
  expect(w.emitted('success')?.[0]).toEqual([{ password: 'fixture-password' }, '900001'])
  w.unmount()
})
