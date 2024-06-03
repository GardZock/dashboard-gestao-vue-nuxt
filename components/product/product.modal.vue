<script setup lang="ts">
import { object, number, string, type InferType, ObjectSchema, boolean } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import { processImage } from '~/server/processImage';
import { update, create } from '~/server/product_crud'
import type { Product } from '~/server/interfaces';

interface ProdCValues {
    name: string;
    normal_price: number;
    quantity: number;
    category: string;
}

interface ProdUValues {
    name: string;
    normal_price: number;
    disc_price: number;
    quantity: number;
    category: string;
}

const props = defineProps<{
    type: "CREATE" | "UPDATE",
    oldProd?: Product,
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

const schema: ObjectSchema<ProdCValues> | ObjectSchema<ProdUValues> = props.type === 'CREATE' ? object({
    name: string().min(10, 'O nome deve conter pelo menos 8 caracteres.').max(150, 'Tamanho máximo de 150 caracteres atingido.').required('Preencha este campo.'),
    normal_price: number().moreThan(10, 'O valor do produto deve ser maior que R$ 10,00.').required('Preencha este campo.').typeError("O valor deve ser um número."),
    quantity: number().moreThan(0, 'A quantidade do produto deve ser maior que 0.').required('Preencha este campo.').typeError("O valor deve ser um número."),
    category: string().oneOf(['Roupas', 'Eletrodomésticos', 'Móveis'], 'Selecione uma categoria válida.').required('Selecione uma categoria.'),
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
        }).required('Escolha uma imagem para o produto.'),
}) : object({
    name: string().min(10, 'O nome deve conter pelo menos 8 caracteres.').max(150, 'Tamanho máximo de 150 caracteres atingido.').required('Preencha este campo.'),
    normal_price: number().moreThan(10, 'O valor do produto deve ser maior que R$ 10,00.').required('Preencha este campo.').typeError("O valor deve ser um número."),
    disc_price: number().moreThan((props.oldProd as Product).normal_price, `O valor do disconto deve ser maior que ${props.oldProd?.normal_price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}.`).required('Preencha este campo.').typeError("O valor deve ser um número."),
    quantity: number().moreThan(0, 'A quantidade do produto deve ser maior que 0.').required('Preencha este campo.').typeError("O valor deve ser um número."),
    category: string().oneOf(['Roupas', 'Eletrosdomésticos', 'Móveis'], 'Selecione uma categoria válida.').required('Selecione uma categoria.'),
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
        }).required('Escolha uma imagem para o produto.')
}) 

type Schema = InferType<typeof schema>

const obj: { [key: string]: any } = {}
for (const i of props.fields) {
    //@ts-ignore
    obj[i.name] = props.oldProd ? i.options?.image ? undefined : props.oldProd[i.name] : undefined
}

const file: Ref<File | null> = ref(null)

const state = reactive(obj)
const handleFileChange = (files: FileList) => {
    file.value = (files as FileList)[0];
};

const emit = defineEmits(['success', 'error'])
async function onSubmit(event: FormSubmitEvent<Schema>) {

    let image = await processImage((file as Ref<File>).value);

    if (props.type === "CREATE") {
        const { name, normal_price, quantity, category } = event.data
        try {
            await create({
                name,
                normal_price,
                quantity,
                category,
                image
            })
        } catch (err) {
            emit('error')
            return await props.close()
        }

        emit('success')
        return await props.close() 
    } else if (props.type === 'UPDATE' && props.oldProd) {
        const { name, normal_price, quantity, category } = event.data

        const compareOldObj = {
            name: props.oldProd.name,
            normal_price: props.oldProd.normal_price,
            quantity: props.oldProd.quantity,
            category: props.oldProd.category,
            image: null
        }

        let compareNewObj: { name: string, normal_price: number, quantity: number, category: string, image?: { base64: string, imgType: string } | null } = {
            name,
            normal_price,
            quantity,
            category
        }

        if (JSON.stringify(compareNewObj) === JSON.stringify(compareOldObj)) {
            if (props.oldProd.image === image || image === null) {
                emit('success')
                return await props.close();
            }
        }

        try {
            compareNewObj.image = image
            await update(props.oldProd._id, compareNewObj)
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
                <h2 class="text-xl">{{ type === "CREATE" ? "Criando" : "Atualizar" }} um produto</h2>
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