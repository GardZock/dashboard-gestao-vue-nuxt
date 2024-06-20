<script setup lang="ts">
import type { Product } from '~/server/interfaces';

const { product } = defineProps<{
    product: Product,
    close: () => Promise<void>
}>()

const avatar = product.image.base64 ? `data:image/${product.image.imgType};base64, ${product.image.base64}` : 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
</script>

<template>
    <UModal>
        <UCard>
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Vizualizar Produto
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                        @click="close" />
                </div>
            </template>
            <UContainer class="justify-center flex">
                <div>
                    <div class="border-b text-center p-4">
                        <div class="p-4 flex justify-center">
                            <img :src="avatar" alt="User Image" class="w-[152px] h-[152px] rounded-md">
                        </div>
                        <h2 class="font-bold text-xl">{{ product.name }}</h2>
                    </div>
                    <div class="pt-4 text-lg flex justify-between">
                        <div>
                            <p class="text-lg font-semibold">Preço</p>
                            <p class="text-base">{{ product.normal_price.toLocaleString('pt-br', {
                        style:
                            'currency', currency: 'BRL'
                    }) }}</p>
                        </div>
                        <div v-if="product.normal_price !== product.disc_price">
                            <p class="text-lg font-semibold">Preço com Desconto</p>
                            <p class="text-base">{{ product.normal_price.toLocaleString('pt-br', {
                        style:
                            'currency', currency: 'BRL'
                    }) }}</p>
                        </div>
                        <div>
                            <p class="text-lg font-semibold">Categoria</p>
                            <p class="text-base">{{ product.category }}</p>
                        </div>
                    </div>
                    <div class="pt-4 text-lg flex justify-between">
                        <div>
                            <p class="text-lg font-semibold">Quantidade</p>
                            <p class="text-base">{{ product.quantity }}</p>
                        </div>
                        <div>
                            <p class="text-lg font-semibold">Vendas Totais</p>
                            <p class="text-base">{{ product.sales.length }}</p>
                        </div>
                    </div>
                </div>
            </UContainer>
        </UCard>
    </UModal>
</template>