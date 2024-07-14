<script setup lang="ts">
import { object, number, string, type InferType, ObjectSchema, boolean } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import { processImage } from '~/server/processImage';
import { update, create } from '~/server/employer_crud'
import type { Employer } from '~/server/interfaces';

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
    oldEmp?: Employer,
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
            },
            checkbox?: {
                style?: string,
                required: boolean
            }
        }
    }[],
    close: () => Promise<void>
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
                return true;
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
                } else {
                    return true
                }
            }
        })
})

type Schema = InferType<typeof schema>

const obj: { [key: string]: any } = {}
for (const i of props.fields) {
    //@ts-ignore
    obj[i.name] = props.oldEmp ? i.options?.image ? undefined : props.oldEmp[i.name] : undefined
}

const file: Ref<File | null> = ref(null)

const state = reactive(obj)
const handleFileChange = (files: FileList) => {
    file.value = (files as FileList)[0];
};

const emit = defineEmits(['success', 'error'])
async function onSubmit(event: FormSubmitEvent<Schema>) {

    let avatarImage = null
    if (file && file.value) {
        avatarImage = await processImage((file as Ref<File>).value);
    }

    if (props.type === "CREATE") {
        const { name, salary, role } = event.data
        try {
            await create({
                name,
                salary,
                role,
                avatarImage
            })
        } catch (err) {
            emit('error')
            return await props.close()
        }

        emit('success')
        return await props.close() 
    } else if (props.type === 'UPDATE' && props.oldEmp) {
        const { name, salary, role, status } = event.data as EmpUValues

        const compareOldObj = {
            name: props.oldEmp.name,
            salary: props.oldEmp.salary,
            role: props.oldEmp.role,
            status: props.oldEmp.status,
            avatarImage: null
        }

        let compareNewObj: { name: string, salary: number, role: string, status: boolean, avatarImage?: { base64: string, imgType: string } | null } = {
            name,
            salary,
            role,
            status
        }

        if (JSON.stringify(compareNewObj) === JSON.stringify(compareOldObj)) {
            if (props.oldEmp.avatarImage === avatarImage || avatarImage === null) {
                emit('success')
                return await props.close();
            }
        }

        try {
            compareNewObj.avatarImage = avatarImage
            await update(props.oldEmp._id, compareNewObj)
        } catch (err) {
            emit('error')
            return await props.close()
        }

        emit('success')
        return await props.close()
    }
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
                        <UCheckbox v-if="field.options?.checkbox" v-model="state[field.name]"
                            :label="field.name" :style="field.options.checkbox.style" />
                    </template>
                </UFormGroup>
                <UButton type="submit" size="xl" class="w-full justify-center">
                    Enviar
                </UButton>
            </UForm>
        </UCard>
    </UModal>
</template>