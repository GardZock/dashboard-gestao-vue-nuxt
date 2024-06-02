<script setup lang="ts">
import { object, number, string, type InferType, ObjectSchema, boolean } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import { processImage } from '~/server/processImage';

type RoleTypes = "Desenvolvimento" | "Recursos Humanos" | "Administração"

interface EmpCValues {
    name: string,
    salary: number,
    role: RoleTypes
}

interface EmpUValues {
    name: string,
    salary: number,
    role: RoleTypes,
    status: boolean
}

const props = defineProps<{
    type: "CREATE" | "UPDATE",
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
            },
            image?: {
                types?: string[],
                description?: string,
                required: boolean
            }
        }
    }[]
}>()

const schema: ObjectSchema<EmpCValues> | ObjectSchema<EmpUValues> = props.type === "CREATE" ? object({
    name: string().min(10, 'O nome deve conter pelo menos 8 caracteres.').max(150, 'Tamanho máximo de 150 caracteres atingido.').required('Preencha este campo.'),
    salary: number().moreThan(1400, 'O salário deve ser um valor maior que R$ 1400,00.').required('Preencha este campo.').typeError("O valor deve ser um número."),
    role: string().oneOf(['Desenvolvimento', 'Recursos Humanos', 'Administração'], 'Selecione um setor válido.').required('Selecione um setor.'),
    photo: string()
        .test({
            message: 'Por favor, utilize um tipo de arquivo suportado.',
            test: (file, context) => {
                if (file) {
                    const isValid = ["png", "jpg", "jpeg", "webp"].includes((file?.split('.') as unknown as string)[1]);
                    if (!isValid) context?.createError();
                    return isValid;
                }
            }
        })
}) : object({
    name: string().min(10, 'O nome deve conter pelo menos 8 caracteres.').max(150, 'Tamanho máximo de 150 caracteres atingido.').required('Preencha este campo.'),
    salary: number().moreThan(1400, 'O salário deve ser um valor maior que R$ 1400,00.').required('Preencha este campo.').typeError("O valor deve ser um número."),
    role: string().oneOf(['Desenvolvimento', 'Recursos Humanos', 'Administração'], 'Selecione um setor válido.').required('Selecione um setor.'),
    status: boolean(),
    photo: string()
        .test({
            message: 'Por favor, utilize um tipo de arquivo suportado.',
            test: (file, context) => {
                if (file) {
                    const isValid = ["png", "jpg", "jpeg", "webp"].includes((file?.split('.') as unknown as string)[1]);
                    if (!isValid) context?.createError();
                    return isValid;
                }
            }
        })
})

type Schema = InferType<typeof schema>

const obj: { [key: string]: undefined } = {}
for (const i of props.fields) {
    obj[i.name] = undefined
}

const file: Ref<File | null> = ref(null)

const state = reactive(obj)
const handleFileChange = (files: FileList) => {
    file.value = (files as FileList)[0];
};

const emit = defineEmits(['success'])
async function onSubmit(event: FormSubmitEvent<Schema>) {

    let image = null

    if (file) {
        if (!file.value) {
            return;
        }
        image = await processImage(file.value);
    }
    console.log(image)
    console.log(event.data)

    emit('success')
}

</script>

<template>
    <UModal>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <h2 class="text-xl">{{ type === "CREATE" ? "Criando" : "Atualizar" }} um funcionário</h2>
            </template>

            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormGroup v-for="field in fields" :label="field.label" :name="field.name">
                    <template v-if="field.options?.text?.description || field.options?.image?.description" #description>
                        <div class="flex items-center gap-1">
                            <UIcon name="i-heroicons-information-circle" />
                            <div>
                                {{ field.options.text ? field.options.text.description :
                                    field.options.image?.description }}
                            </div>
                        </div>
                    </template>
                    <template #default>
                        <UInput v-if="field.options?.text" v-model="state[field.name]"
                            :placeholder="field.options.text.placeholder" :size="field.options.text.size"
                            :color="field.options.text.color" />
                        <UInputMenu v-if="field.options?.select_menu" v-model="state[field.name]" size="xl"
                            :options="field.options.select_menu.options"
                            :placeholder="field.options.select_menu.placeholder" />
                        <UInput v-if="field.options?.image" v-model="state[field.name]" @change="handleFileChange"
                            :accept="field.options.image.types?.join(', ')" type="file" size="xl" />
                    </template>
                </UFormGroup>
                <UButton type="submit" size="xl" class="w-full justify-center">
                    Enviar
                </UButton>
            </UForm>
        </UCard>
    </UModal>
</template>