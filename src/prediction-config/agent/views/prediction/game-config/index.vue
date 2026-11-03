<template>
    <p v-if="!allowed" role="alert">当前账号无权管理预测配置。商户端仅代理商主账号可管理；白标账号需有所属站点的玩法配置权限。</p>
    <p v-else-if="loading" role="status">正在读取配置…</p>
    <div v-else-if="error" role="alert">{{ error }} <el-button @click="load()">重试</el-button></div>
    <template v-else-if="model?.config_model === 'OWNER_V1' || model?.config_model === 'SCOPED_OWNER_V1'">
        <OwnerConfig :key="`${session}:${model.actor.config_site_id ?? ''}`" :actor="model.actor" />
    </template>
    <SiteConfig v-else-if="model?.config_model === 'SITE_V1'" :key="session" />
    <p v-else role="alert">当前配置模式尚未接入此页面，请联系管理员确认切换；原有未确认请求保持原样。</p>
</template>
<script setup lang="ts">
import { ElButton } from 'element-plus'
import { computed, ref, shallowRef, watch, onBeforeUnmount } from 'vue'
import { useAgentConfigRuntime, useConfigUser } from '../../../../runtime'
import type { OwnerModel } from '../../../api/prediction/owner-types'
import { identity, integer } from '../shared/format'
import { canManageOwnerConfig, scopedOwnerActor } from './owner-model'
import { readOwnerPending } from './owner-mutation'
import { readPending as readGridPending } from '../../grid/config/model'
import { gridPendingStorage } from '../../grid/config/pending-scope'
import OwnerConfig from './OwnerConfig.vue'
import SiteConfig from './SiteConfig.vue'

const api = useAgentConfigRuntime().api, user = useConfigUser()
const model = shallowRef<OwnerModel | null>(null), loading = ref(false), error = ref('')
const allowed = computed(() => user.userInfo.can_manage_prediction_config === true && (user.perms.includes('*') || user.perms.includes('prediction_config:lists')) && identity(user.userInfo.id) !== null)
const session = computed(() => `${user.userInfo.id}:${user.token}`)
let generation = 0, controller: AbortController | undefined

async function load() {
    const ticket = ++generation, binding = session.value
    controller?.abort(); model.value = null; error.value = ''; loading.value = false
    if (!allowed.value) return
    controller = new AbortController(); loading.value = true
    const active = () => ticket === generation && binding === session.value && allowed.value
    try {
        const value = await api.ownerConfigurationModel(controller.signal)
        if (!active()) return
        if (value.actor?.operator_id !== identity(user.userInfo.id) || !['AGENT_V1', 'SITE_V1', 'OWNER_V1', 'SCOPED_OWNER_V1'].includes(value.config_model)) throw Error('INVALID_MODEL')
        if (value.config_model === 'SCOPED_OWNER_V1' && value.actor.kind === 'SITE') {
            const actor = value.actor
            if (actor.agent_id !== '0' || !integer(actor.tenant_id, true) || !Array.isArray(actor.site_ids) || actor.site_ids.length !== 1 || !integer(actor.site_ids[0], true)) throw Error('INVALID_SITES')
            // A pending save belongs to its original site even after the tenant binding changes.
            const pending = readOwnerPending(localStorage)
            const pendingSite = pending?.operator_id === actor.operator_id && pending.kind === 'SITE' ? pending.config_site_id : undefined
            const gridPending = readGridPending(gridPendingStorage(sessionStorage, actor))
            const gridSite = gridPending?.command.site_id
            const site = actor.site_ids[0]!
            if ((pendingSite && pendingSite !== site) || (gridSite && gridSite !== site) || !api.initializeSiteConfigurations) throw Error('SITE_UNAVAILABLE')
            if (!pendingSite && !gridSite) {
                const initialized = await api.initializeSiteConfigurations(site, controller.signal)
                if (!active()) return
                if (!Number.isSafeInteger(initialized.created) || initialized.created < 0) throw Error('INVALID_INITIALIZATION')
            }
            model.value = { config_model: value.config_model, actor: { operator_id: actor.operator_id, agent_id: '0', kind: 'SITE', config_site_id: site, tenant_id: actor.tenant_id } }
            return
        }
        if (!canManageOwnerConfig(value.actor) || (value.config_model === 'SCOPED_OWNER_V1') !== scopedOwnerActor(value.actor)) throw Error('INVALID_MODEL')
        if (value.config_model === 'SCOPED_OWNER_V1') {
            if (!api.initializeOwnerConfigurations) throw Error('INITIALIZATION_UNAVAILABLE')
            const initialized = await api.initializeOwnerConfigurations(controller.signal)
            if (!active()) return
            if (!Number.isSafeInteger(initialized.created) || initialized.created < 0) throw Error('INVALID_INITIALIZATION')
        }
        model.value = value
    } catch { if (active()) error.value = '无法加载当前账号的配置，请重试。' }
    finally { if (ticket === generation) loading.value = false }
}
watch(() => [session.value, allowed.value], () => { void load() }, { immediate: true, flush: 'sync' })
onBeforeUnmount(() => { generation++; controller?.abort() })
</script>
