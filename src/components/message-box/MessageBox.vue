<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

import { useId } from '../../composables/use-id'
import { useLocale } from '../../composables/use-locale'
import { MmButton } from '../button'
import { MmDialog } from '../dialog'
import type { DialogCloseReason } from '../dialog'
import { MmInput } from '../input'
import type { MessageBoxAction, MessageBoxProps } from './types'

defineOptions({ name: 'MmMessageBox' })

const props = withDefaults(defineProps<MessageBoxProps>(), {
  closeOnClickModal: false,
  closeOnEscape: true,
  inputValidator: undefined,
  inputValue: '',
  message: '',
  modelValue: false,
  type: 'alert',
})
const emit = defineEmits<{
  action: [action: MessageBoxAction, value: string]
  'update:inputValue': [value: string]
  'update:modelValue': [value: boolean]
}>()
const { messages } = useLocale()
const resolvedCancelText = computed(() => props.cancelButtonText ?? messages.value.common.cancel)
const resolvedConfirmText = computed(() => props.confirmButtonText ?? messages.value.common.confirm)
const resolvedInputPlaceholder = computed(() => props.inputPlaceholder ?? messages.value.messageBox.placeholder)
const resolvedTitle = computed(() => props.title ?? messages.value.messageBox.title)
const visible = ref(props.modelValue)
const value = ref(props.inputValue)
const error = ref('')
const validating = ref(false)
const inputRef = ref<{ focus: () => void }>()
const messageId = useId('mm-message-box-message')
const errorId = useId('mm-message-box-error')
let settled = false

watch(() => props.modelValue, (next) => {
  visible.value = next
  if (next) settled = false
})
watch(() => props.inputValue, (next) => { value.value = next })
watch(value, (next) => emit('update:inputValue', next))

function finish(action: MessageBoxAction): void {
  if (settled) return
  settled = true
  visible.value = false
  emit('update:modelValue', false)
  emit('action', action, value.value)
}

async function confirm(): Promise<void> {
  if (validating.value) return
  error.value = ''
  if (props.type === 'prompt' && props.inputValidator) {
    validating.value = true
    try {
      const result = await props.inputValidator(value.value)
      if (result !== true) {
        error.value = typeof result === 'string' ? result : messages.value.messageBox.invalidInput
        await nextTick()
        inputRef.value?.focus()
        return
      }
    } finally {
      validating.value = false
    }
  }
  finish('confirm')
}

function onDialogClose(reason: DialogCloseReason): void {
  finish(reason === 'close' ? 'close' : 'cancel')
}
</script>

<template>
  <MmDialog
    v-model="visible"
    :aria-describedby="message ? messageId : undefined"
    :close-on-click-modal="closeOnClickModal"
    :close-on-escape="closeOnEscape"
    panel-class="mm-message-box"
    :title="resolvedTitle"
    :width="440"
    @close="onDialogClose"
  >
    <p v-if="message" :id="messageId" class="mm-message-box__message">{{ message }}</p>
    <div v-if="type === 'prompt'" class="mm-message-box__prompt">
      <MmInput
        v-model="value"
        ref="inputRef"
        data-message-box-input
        :aria-label="messages.messageBox.input"
        :aria-describedby="error ? errorId : undefined"
        :placeholder="resolvedInputPlaceholder"
        :status="error ? 'error' : undefined"
        @keyup.enter="confirm"
      />
      <p v-if="error" :id="errorId" class="mm-message-box__error" role="alert">{{ error }}</p>
    </div>
    <template #footer>
      <MmButton v-if="type !== 'alert'" data-message-box-cancel @click="finish('cancel')">{{ resolvedCancelText }}</MmButton>
      <MmButton data-message-box-confirm :loading="validating" variant="primary" @click="confirm">{{ resolvedConfirmText }}</MmButton>
    </template>
  </MmDialog>
</template>

<style src="./message-box.css"></style>
