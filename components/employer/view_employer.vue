<script setup lang="ts">
import type { Employer } from '~/server/interfaces';

const { employer } = defineProps<{
    employer: Employer,
    close: () => Promise<void>
}>()

const avatar = employer.avatarImage.base64 ? `data:image/${employer.avatarImage.imgType};base64, ${employer.avatarImage.base64}` : 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
</script>

<template>
    <UModal>
        <UCard>
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Vizualizar Funcionário
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
                        <h2 class="font-bold text-xl">{{ employer.name }}</h2>
                    </div>
                    <div class="pt-4 text-lg flex justify-between">
                        <div>
                            <p class="text-lg font-semibold">Salário</p>
                            <p class="text-base">{{ employer.salary.toLocaleString('pt-br', {
                        style:
                            'currency', currency: 'BRL'
                    }) }}</p>
                        </div>
                        <div>
                            <p class="text-lg font-semibold">Cargo</p>
                            <p class="text-base">{{ employer.role }}</p>
                        </div>
                    </div>
                </div>
            </UContainer>
        </UCard>
    </UModal>
</template>