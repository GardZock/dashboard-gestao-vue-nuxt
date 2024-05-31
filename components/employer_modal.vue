<script setup lang="ts">
import { object, number, string, type InferType, array, ObjectSchema } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

interface EmpValues {
    name: string,
    salary: number,
    role: "Desenvolvimento" | "Recursos Humanos" | "Administração"
}

const props = defineProps<{
    fields: {
        label: string,
        name: string,
        options?: {
            text?: {
                placeholder: string,
                color?: string,
                description?: string,
                size?: "xl" | "lg" | "md",
                required: boolean
            },
            select_menu?: {
                options?: string[],
                placeholder: string,
                required: boolean
            }
        }
    }[]
}>()

const schema: ObjectSchema<EmpValues> = object({
    name: string().min(10, 'O nome deve conter pelo menos 8 caracteres.').max(150, 'Tamanho máximo de 150 caracteres atingido.').required('Preencha este campo.'),
    salary: number().moreThan(1400, 'O salário deve ser um valor maior que R$ 1400,00.').required('Preencha este campo.').typeError("O valor deve ser um número."),
    role: string().oneOf(['Desenvolvimento', 'Recursos Humanos', 'Administração'], 'Selecione um setor válido.').required('Selecione um setor.')
})

type Schema = InferType<typeof schema>

const obj: { [key: string]: undefined } = {}
for (const i of props.fields) {
    obj[i.name] = undefined
}

const state = reactive(obj)

const emit = defineEmits(['success'])
async function onSubmit(event: FormSubmitEvent<Schema>) {
    // Do something with event.data
    console.log(event.data)
    emit('success')
}

</script>

<template>
    <UModal>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <h2 class="text-xl">Criando um funcionário</h2>
            </template>

            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormGroup v-for="field in fields" :label="field.label" :name="field.name">
                    <template v-if="field.options?.text?.description" #description>
                        <div class="flex items-center gap-1">
                            <UIcon name="i-heroicons-information-circle" />
                        <div>
                            {{ field.options.text.description }}
                        </div>
                        </div>
                    </template>
                    <template #default>
                        <UInput v-if="field.options?.text" v-model="state[field.name]"
                        :placeholder="field.options.text.placeholder" :size="field.options.text.size"
                        :color="field.options.text.color" />
                    <USelectMenu v-if="field.options?.select_menu" v-model="state[field.name]" size="xl"
                        :options="field.options.select_menu.options"
                        :placeholder="field.options.select_menu.placeholder" />
                    </template>
                </UFormGroup>
                <UButton type="submit">
                    Enviar
                </UButton>
            </UForm>
        </UCard>
    </UModal>
</template>