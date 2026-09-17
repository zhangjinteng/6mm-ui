import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import Form from '../Form.vue'
import FormItem from '../FormItem.vue'
import { MmInput } from '../../input'

interface FormMethods {
  clearValidate: (props?: string | string[]) => void
  resetFields: (props?: string | string[]) => void
  validate: () => Promise<boolean>
  validateField: (props: string | string[]) => Promise<boolean>
}

describe('MmForm', () => {
  it('registers fields and validates synchronous rules with accessible errors', async () => {
    const Host = defineComponent({
      components: { Form, FormItem, MmInput },
      setup() {
        const model = ref({ email: '' })
        const rules = {
          email: [
            { message: '请输入邮箱', required: true },
            { message: '邮箱格式无效', pattern: /^[^@]+@[^@]+$/ },
          ],
        }
        return { model, rules }
      },
      template: `
        <Form ref="form" :model="model" :rules="rules">
          <FormItem label="通知邮箱" prop="email"><MmInput v-model="model.email" /></FormItem>
        </Form>
      `,
    })
    const wrapper = mount(Host)
    const form = wrapper.getComponent(Form).vm as unknown as FormMethods

    expect(await form.validate()).toBe(false)
    await nextTick()
    expect(wrapper.get('[role="alert"]').text()).toBe('请输入邮箱')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('label').attributes('for')).toBe(wrapper.get('input').attributes('id'))

    await wrapper.get('input').setValue('ops@6mm.com')
    expect(await form.validate()).toBe(true)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('supports async validation, clearValidate, validateField, and resetFields', async () => {
    const Host = defineComponent({
      components: { Form, FormItem, MmInput },
      setup() {
        const model = ref({ alias: 'operator' })
        const rules = {
          alias: {
            trigger: 'blur' as const,
            validator: async (value: unknown) => {
              await Promise.resolve()
              return value === 'reserved' ? '别名已被占用' : true
            },
          },
        }
        return { model, rules }
      },
      template: `
        <Form :model="model" :rules="rules">
          <FormItem label="操作员别名" prop="alias"><MmInput v-model="model.alias" /></FormItem>
        </Form>
      `,
    })
    const wrapper = mount(Host)
    const form = wrapper.getComponent(Form).vm as unknown as FormMethods

    await wrapper.get('input').setValue('reserved')
    expect(await form.validateField('alias')).toBe(false)
    expect(wrapper.get('[role="alert"]').text()).toBe('别名已被占用')

    form.clearValidate('alias')
    await nextTick()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)

    form.resetFields()
    await nextTick()
    expect((wrapper.vm as unknown as { model: { alias: string } }).model.alias).toBe('operator')
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('operator')
  })

  it('inherits disabled and size state from the form', () => {
    const Host = defineComponent({
      components: { Form, FormItem, MmInput },
      setup: () => ({ model: ref({ key: 'locked' }) }),
      template: `
        <Form disabled :model="model" size="lg">
          <FormItem label="密钥" prop="key"><MmInput v-model="model.key" /></FormItem>
        </Form>
      `,
    })
    const wrapper = mount(Host)

    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.mm-input').classes()).toContain('mm-input--lg')
  })
})
