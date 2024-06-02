<script setup lang="ts">
import type { Product } from '~/server/interfaces';

const search = ref('')

const sort = ref({ column: 'name', direction: 'asc' as const })
// FUTURAS ADIÇÕES
const page = ref(1)
const pageCount = ref(10)
const pageTotal = ref(20)
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

// // REQUEST DATA
// const headers = new Headers();
// headers.append("Content-Type", "application/json")

// const { pending, data: employees } = await useLazyAsyncData<Employer[]>('employees', () => $fetch(`http://localhost:8000/employees?id=${search.value ? search.value : "ALL"}`,
//     {
//         method: 'get',
//         headers,
//     }), {
//     default: () => [],
//     watch: [page, search, pageCount, sort]
// })

const products: Product[] = [
    {
        name: "Camiseta",
        price: 50,
        quantity: 100,
        category: "ROUPA",
        sales: [
            { id: "1", price: 45, quantity: 10 },
            { id: "2", price: 40, quantity: 5 }
        ],
        id: "prod1"
    },
    {
        name: "Calça Jeans",
        price: 120,
        quantity: 50,
        category: "ROUPA",
        sales: [
            { id: "3", price: 110, quantity: 7 }
        ],
        id: "prod2"
    },
    {
        name: "Sofá",
        price: 1500,
        quantity: 10,
        category: "MÓVEIS",
        sales: [
            { id: "4", price: 1400, quantity: 2 }
        ],
        id: "prod3"
    },
    {
        name: "Mesa de Jantar",
        price: 800,
        quantity: 15,
        category: "MÓVEIS",
        id: "prod4"
    },
    {
        name: "Smartphone",
        price: 2500,
        quantity: 30,
        category: "ELETRÔNICOS",
        sales: [
            { id: "5", price: 2400, quantity: 5 },
            { id: "6", price: 2300, quantity: 3 }
        ],
        id: "prod5"
    },
    {
        name: "Televisão",
        price: 3000,
        quantity: 20,
        category: "ELETRÔNICOS",
        sales: [
            { id: "7", price: 2800, quantity: 4 }
        ],
        id: "prod6"
    },
    {
        name: "Micro-ondas",
        price: 400,
        quantity: 25,
        category: "ELETRÔNICOS",
        id: "prod7"
    },
    {
        name: "Geladeira",
        price: 3500,
        quantity: 8,
        category: "ELETRÔNICOS",
        sales: [
            { id: "8", price: 3400, quantity: 1 }
        ],
        id: "prod8"
    },
    {
        name: "Cadeira de Escritório",
        price: 500,
        quantity: 40,
        category: "MÓVEIS",
        sales: [
            { id: "9", price: 450, quantity: 6 }
        ],
        id: "prod9"
    },
    {
        name: "Vestido",
        price: 200,
        quantity: 60,
        category: "ROUPA",
        id: "prod10"
    }
];

const filteredRows = computed(() => {
    if (products) {
        if (!search.value) {
            return products
        }

        return products.filter((prod) => {
            return Object.values(prod).some((value) => {
                return String(value).toLowerCase().includes(search.value.toLowerCase())
            })
        })
    } else return undefined;
})

</script>

<template>
    <div class="flex w-full items-center gap-4 border-b">
        <div class="flex w-full py-5 pl-4 border-gray-200 dark:border-gray-700">
            <UInput v-model="search" placeholder="Filtrar produtos..." class="w-full"
                icon="i-heroicons-magnifying-glass-20-solid" size="xl" trailing />
        </div>
        <div v-if="filteredRows">
            <UButton icon="i-heroicons-plus-20-solid" size="xl" color="gray" square variant="solid" />
        </div>
    </div>

    <ul class="divide-y divide-gray-200 dark:divide-gray-500">
        <li v-for="prod in filteredRows" class="flex">
            <div class="p-4">
                <img src="../public/img.jpg" class="rounded-lg w-[256px]" :alt="prod.name">
            </div>
            <div class="p-4">
                <div>
                    <h2 class="font-semibold text-2xl">{{ prod.name }}</h2>
                </div>
                <div class="flex gap-2">
                    <p class="text-lg line-through">{{ prod.price.toLocaleString('pt-br', {
                        style: 'currency', currency:
                            'BRL'
                    }) }}</p>
                    <p class="text-xl font-semibold text-green-500">{{ prod.price.toLocaleString('pt-br', {
                        style:
                            'currency', currency: 'BRL'
                    }) }}</p>
                </div>
                <div class="mt-5 flex gap-5 w-full">
                    <p><strong>Categoria:</strong> {{ prod.category[0].toUpperCase() + prod.category.slice(1,
                        prod.category.length).toLowerCase() }}</p>
                    <p><strong>Estoque:</strong> {{ prod.quantity }}</p>
                    <p><strong>Vendas:</strong> {{ prod.sales?.length ? prod.sales.length : 0 }}</p>
                </div>
                <div class="w-full">
                    <ul class="flex w-full mt-5 justify-between">
                        <li>
                            <UButton icon="i-heroicons-pencil-square" size="lg" color="gray" square variant="solid" />
                        </li>
                        <li>
                            <UButton icon="i-heroicons-information-circle" size="lg" color="gray" square
                                variant="solid" />
                        </li>
                        <li>
                            <UButton icon="i-heroicons-trash" size="lg" color="red" square variant="solid" />
                        </li>
                    </ul>
                </div>
            </div>
        </li>
    </ul>

    <div class="flex flex-wrap justify-between items-center p-4 border-t">
        <div>
            <span class="text-lg leading-5">
                Mostrando
                <span class="font-medium">{{ pageFrom }}</span>
                até
                <span class="font-medium">{{ pageTo }}</span>
                de
                <span class="font-medium">{{ pageTotal }}</span>
                resultados.
            </span>
        </div>

        <UPagination v-model="page" :page-count="pageCount" :total="pageTotal" :ui="{
            wrapper: 'flex items-center gap-1',
            rounded: '!rounded-full min-w-[32px] justify-center',
            default: {
                activeButton: {
                    variant: 'outline'
                }
            }
        }" />
    </div>
</template>