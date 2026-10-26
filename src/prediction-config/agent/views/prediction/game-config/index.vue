<template>
    <p v-if="!allowed" role="alert">仅代理商主账号可查看和修改预测配置。</p>
    <p v-else-if="loading" role="status">正在读取配置模式…</p>
    <div v-else-if="error" role="alert">{{ error }} <el-button @click="load">重试</el-button></div>
    <OwnerConfig v-else-if="model?.config_model === 'OWNER_V1'" :key="session" :actor="model.actor" />
    <SiteConfig v-else-if="model?.config_model === 'SITE_V1'" :key="session" />
    <p v-else role="alert">当前配置模式尚未接入此页面，请联系管理员确认切换；原有未确认请求保持原样。</p>
</template>
<script setup lang="ts">
import { ElButton } from 'element-plus'

import { useAgentConfigRuntime } from '../../../../runtime'
const { ownerConfigurationModel } = useAgentConfigRuntime().api

import {computed,ref,shallowRef,watch,onBeforeUnmount} from 'vue'
import { useConfigUser as useUserStore } from '../../../../runtime'
import type {OwnerModel} from '../../../api/prediction/owner-types'
import {identity} from '../shared/format'
import {canManageOwnerConfig} from './owner-model'
import OwnerConfig from './OwnerConfig.vue'
import SiteConfig from './SiteConfig.vue'
const user=useUserStore(),model=shallowRef<OwnerModel|null>(null),loading=ref(false),error=ref('')
const allowed=computed(()=>user.userInfo.can_manage_prediction_config===true && (user.perms.includes('*')||user.perms.includes('prediction_config:lists')) && identity(user.userInfo.id)!==null)
const session=computed(()=>`${user.userInfo.id}:${user.token}`)
let generation=0,controller:AbortController|undefined
async function load() {
    const ticket=++generation,binding=session.value;controller?.abort();model.value=null;error.value='';loading.value=false
    if(!allowed.value)return
    controller=new AbortController();loading.value=true
    try {const value=await ownerConfigurationModel(controller.signal);if(ticket!==generation||binding!==session.value||!allowed.value)return
        if(!canManageOwnerConfig(value.actor)||value.actor.operator_id!==identity(user.userInfo.id)||!['AGENT_V1','SITE_V1','OWNER_V1'].includes(value.config_model))throw Error('INVALID_MODEL')
        model.value=value
    } catch {if(ticket===generation)error.value='无法确认当前账号的配置模式，请重试。'}
    finally{if(ticket===generation)loading.value=false}
}
watch(()=>[session.value,allowed.value],load,{immediate:true,flush:'sync'})
onBeforeUnmount(()=>{generation++;controller?.abort()})
</script>
