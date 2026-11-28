<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { MmButton } from '../button'
import { MmInput } from '../input'
import type { DomainBindingRow, DomainBindingRequest } from './model'

const p=defineProps<{siteId:string; request:DomainBindingRequest; editable:boolean; disabled:boolean; english:boolean}>()
const emit=defineEmits<{ updated:[names:string[]]; publication:[] }>()
const rows=ref<DomainBindingRow[]>([]), input=ref(''), busy=ref(false), error=ref(''), copied=ref('')
let disposed=false, timer:ReturnType<typeof setTimeout>, loaded=false
const t=(zh:string,en:string)=>p.english?en:zh
const labels:Record<string,[string,string]>={
  waiting_for_platform_ips:['等待平台固定 IP','Waiting for platform IPs'],waiting_for_dns:['等待 DNS 验证','Waiting for DNS'],
  creating:['正在提交开通','Creating'],provisioning:['开通中','Provisioning'],pending_validation:['证书验证中','Validating certificate'],
  deploying:['部署中','Deploying'],publishing:['正在发布到站点','Publishing to site'],active:['已启用','Active'],deleting:['解绑中','Removing'],
  disabled:['已禁用，请联系运维','Disabled; contact support'],certificate_error:['证书异常，请检查 DNS','Certificate error; check DNS'],
  not_found:['绑定未找到，请联系运维','Binding not found; contact support']
}
const title=(s:string)=>labels[s]?.[p.english?1:0]??s
async function run(action:Parameters<DomainBindingRequest>[1]='list', domain?:string) {
  if(disposed||busy.value||(action!=='list'&&(!p.editable||p.disabled)))return
  if(action==='remove'&&!window.confirm(t('确认解绑或取消接入：','Remove or cancel binding: ')+domain+'?'))return
  clearTimeout(timer); busy.value=true; error.value=''
  try{
    const result=await p.request(p.siteId,action,domain)
    if(disposed)return
    const active=(items:DomainBindingRow[])=>JSON.stringify(items.filter(r=>r.status==='active').map(r=>r.domain).sort())
    const changed=loaded&&active(rows.value)!==active(result.bindings)
    rows.value=result.bindings; loaded=true
    emit('updated',rows.value.map(r=>r.domain))
    if(changed&&!p.disabled)emit('publication')
    if(action==='prepare')input.value=''
  }catch(e){
    if(!disposed)error.value=(e as {response?:{data?:{msg?:string}}})?.response?.data?.msg || (typeof e==='string'?e:(e as Error)?.message) || t('操作失败，请刷新重试','Request failed; please refresh')
  }finally{
    busy.value=false
    if(!disposed&&rows.value.some(r=>!r.retryable&&['creating','provisioning','pending_validation','deploying','publishing','deleting'].includes(r.status)))timer=setTimeout(()=>void run(),15000)
  }
}
async function copy(value:string){try{await navigator.clipboard.writeText(value);copied.value=value}catch{error.value=t('请手动复制记录值','Please copy the value manually')}}
onMounted(()=>void run());onBeforeUnmount(()=>{disposed=true;clearTimeout(timer)})
</script>
<template>
  <section class="wl-bindings" :aria-label="t('域名接入','Domain onboarding')">
    <div class="wl-bindings__line"><strong>{{t('域名接入','Domain onboarding')}}</strong>
      <MmButton size="sm" :disabled="busy" @click="run()">{{t('刷新状态','Refresh')}}</MmButton></div>
    <form v-if="editable" class="wl-bindings__line" @submit.prevent="run('prepare',input.trim())">
      <MmInput v-model="input" :aria-label="t('新域名','New hostname')" placeholder="shop.example.com" :maxlength="253" :disabled="busy||disabled" />
      <MmButton native-type="submit" :disabled="busy||disabled||!input.trim()">{{t('获取解析说明','Get DNS records')}}</MmButton>
    </form>
    <small>{{t('已有线上流量的域名请先联系运维迁移；无需更换 DNS 服务器。','For an existing live site, contact operations before changing DNS.')}}</small>
    <p v-if="error" role="alert">{{error}}</p>
    <article v-for="r in rows" :key="r.domain">
      <div class="wl-bindings__line"><strong>{{r.domain}}</strong><span>{{title(r.status)}}</span></div>
      <p v-if="r.error" role="status">{{r.error}}</p>
      <div v-for="rec in r.dnsRecords" :key="rec.type"><span>{{rec.type}} · {{rec.name}}</span>
        <div v-for="v in rec.values" :key="v" class="wl-bindings__line"><code>{{v}}</code>
          <MmButton size="sm" @click="copy(v)">{{copied===v?t('已复制','Copied'):t('复制','Copy')}}</MmButton></div></div>
      <div v-if="editable" class="wl-bindings__actions">
        <MmButton v-if="r.retryable" size="sm" :disabled="busy||disabled" @click="run('retry',r.domain)">{{t('重试原操作','Retry operation')}}</MmButton>
        <MmButton v-if="r.status==='waiting_for_dns'" size="sm" variant="primary" :disabled="busy||disabled" @click="run('verify',r.domain)">{{t('我已配置，开始验证','Verify DNS')}}</MmButton>
        <MmButton v-if="r.status!=='deleting' && r.status!=='creating'" size="sm" :disabled="busy||disabled" @click="run('remove',r.domain)">{{t('取消接入 / 解绑','Cancel / remove')}}</MmButton>
      </div>
    </article>
  </section>
</template>
<style scoped>
.wl-bindings{display:grid;gap:.65rem;margin-block:1rem}.wl-bindings article{display:grid;gap:.5rem;padding:.75rem;border:1px solid var(--mm-border-color,#d7dce3);border-radius:.5rem}.wl-bindings__line,.wl-bindings__actions{display:flex;align-items:center;justify-content:space-between;gap:.6rem}.wl-bindings__actions{justify-content:flex-end}.wl-bindings code{overflow-wrap:anywhere}.wl-bindings small{opacity:.78}.wl-bindings [role=alert]{color:var(--mm-danger,#bd3838)}
</style>
