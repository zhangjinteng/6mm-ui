import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import DomainBindingPanel from './DomainBindingPanel.vue'
import type { DomainBindingRequest } from './model'

describe('shared domain onboarding', () => {
  it('obtains DNS records, then verifies the saved hostname as a separate action', async () => {
    const request=vi.fn<DomainBindingRequest>(async (_,action)=>({bindings:action==='list'?[]:[{
      domain:'shop.example.com',status:action==='prepare'?'waiting_for_dns':'creating',
      dnsRecords:[{type:'TXT',name:'_6mm-verify.shop',values:['unique-proof']}]
    }]}))
    const w=mount(DomainBindingPanel,{props:{siteId:'10',request,editable:true,english:false,disabled:false}})
    await flushPromises()
    await w.get('input').setValue('shop.example.com')
    await w.get('form').trigger('submit')
    await flushPromises()
    expect(request).toHaveBeenNthCalledWith(2,'10','prepare','shop.example.com')
    expect(w.text()).toContain('unique-proof')
    await w.findAll('button').find(b=>b.text().includes('开始验证'))!.trigger('click')
    await flushPromises()
    expect(request).toHaveBeenNthCalledWith(3,'10','verify','shop.example.com')
    w.unmount()
  })
  it('does not offer write actions to read-only operators', async () => {
    const request=vi.fn<DomainBindingRequest>(async()=>({bindings:[{domain:'demo.test',status:'active',dnsRecords:[]}]}))
    const w=mount(DomainBindingPanel,{props:{siteId:'10',request,editable:false,english:false,disabled:false}})
    await flushPromises()
    expect(w.find('form').exists()).toBe(false)
    expect(w.findAll('button').map(b=>b.text())).toEqual(['刷新状态'])
    w.unmount()
  })
})
