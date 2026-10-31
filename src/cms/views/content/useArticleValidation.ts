import { computed, nextTick, reactive, ref, watch, type Ref } from 'vue'
import {
    articleFields,
    articleFieldErrors,
    validateArticle,
    type ArticleErrors,
    type ArticleField,
    type ArticleForm,
    type ArticleModule
} from './articleValidation'

export function useArticleValidation(
    form: ArticleForm,
    categories: () => { id: string; effective_enabled: boolean }[],
    module: ArticleModule,
    seoOpen: Ref<boolean>
) {
    const editorRoot = ref<HTMLElement>()
    const seoInput = ref<HTMLTextAreaElement>()
    const attempted = ref<'draft' | 'publish' | null>(null)
    const validationNow = ref(Date.now())
    const serverErrors = reactive<ArticleErrors>({})
    const saveError = ref('')
    const fieldRules = Object.fromEntries(
        articleFields.map((field) => [
            field,
            { required: field === 'title' || field === 'category_id', trigger: 'submit' as const }
        ])
    )
    const localErrors = computed(() =>
        attempted.value
            ? validateArticle(
                  form,
                  categories(),
                  module,
                  attempted.value === 'draft'
                      ? 'draft'
                      : form.scheduled_local
                        ? 'scheduled'
                        : 'published',
                  validationNow.value
              )
            : {}
    )
    const fieldErrors = computed<ArticleErrors>(() => ({ ...serverErrors, ...localErrors.value }))
    const pendingCount = computed(() => Object.keys(fieldErrors.value).length)
    for (const field of articleFields)
        watch(
            () => form[field],
            () => {
                delete serverErrors[field]
                saveError.value = ''
                validationNow.value = Date.now()
            },
            { deep: true }
        )
    function focusSeoError() {
        if (fieldErrors.value.seo_description) seoInput.value?.focus()
    }
    async function focusFirstError() {
        await nextTick()
        const field = [
            ...(editorRoot.value?.querySelectorAll<HTMLElement>('[data-prop]') || [])
        ].find((el) => fieldErrors.value[el.dataset.prop as ArticleField])
        if (!field && fieldErrors.value.seo_description) {
            if (seoOpen.value) focusSeoError()
            else seoOpen.value = true
            return
        }
        if (!field) return
        field.scrollIntoView({ block: 'center', behavior: 'auto' })
        const control =
            field.querySelector<HTMLElement>(
                '[contenteditable="true"], [role="combobox"]:not([aria-disabled="true"])'
            ) ||
            field.querySelector<HTMLElement>(
                'input:not(:disabled), textarea:not(:disabled), button:not(:disabled)'
            )
        control?.focus({ preventScroll: true })
    }
    async function validateSave(status: 'draft' | 'published' | 'scheduled') {
        attempted.value = status === 'draft' ? 'draft' : 'publish'
        validationNow.value = Date.now()
        saveError.value = ''
        for (const field of articleFields) delete serverErrors[field]
        if (pendingCount.value) {
            await focusFirstError()
            return false
        }
        return true
    }
    function setSaveFailure(error: unknown) {
        const failure = articleFieldErrors(error, module)
        Object.assign(serverErrors, failure.fields)
        saveError.value = failure.general
    }
    return {
        editorRoot,
        seoInput,
        fieldRules,
        fieldErrors,
        pendingCount,
        saveError,
        validateSave,
        setSaveFailure,
        focusFirstError,
        focusSeoError
    }
}
