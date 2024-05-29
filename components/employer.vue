<script setup lang="ts">
interface Employer {
    name: string,
    status: boolean | string,
    salary: number | string,
    role: string,
    id: string
}

const columns = [{
    key: 'name',
    label: 'Nome',
    sortable: true
}, {
    key: 'role',
    label: 'Cargo'
}, {
    key: 'salary',
    label: 'Salário',
    sortable: true,
    direction: 'asc' as const
}, {
    key: 'status',
    label: 'Status',
}, {
    key: 'actions'
}]

const items = (row: { id: any; }) => [
    [{
        label: 'Edit',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => console.log('Edit', row.id)
    }, {
        label: 'Delete',
        icon: 'i-heroicons-trash-20-solid',
        click: async () => {
            await useFetch(`localhost:5000/api/delete?id=${row.id}`)
        }
    }], [{
        label: 'Ver Mais',
        icon: 'i-heroicons-information-circle-20-solid',
        click: async () => {

            const headers = new Headers();
            headers.append("Content-Type", "application/json")

            const test = await $fetch(`http://localhost:8000/employees`,
                {
                    method: 'get',
                    headers,
                    body: JSON.stringify({
                        "id": "12312451235"
                    }),
                })


        }
    }]
]

const filterStatus = [{
    key: 'on_serv',
    label: 'Em serviço',
    value: false
}, {
    key: 'off_serv',
    label: 'Desligado',
    value: true
}, {
    key: 'all',
    label: 'Todos',
    value: "ALL"
}]


const search = ref('')
const selectedStatus: Ref<{ key: string, label: string, value: string | boolean }> = ref(filterStatus[2])

const sort = ref({ column: 'name', direction: 'asc' as const })
// FUTURAS ADIÇÕES
const page = ref(1)
const pageCount = ref(10)
const pageTotal = ref(20)
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

// REQUEST DATA
const headers = new Headers();
headers.append("Content-Type", "application/json")

const { pending, data: employees } = await useLazyAsyncData<Employer[]>('employees', () => $fetch(`http://localhost:8000/employees?id=${search.value ? search.value : "ALL"}`,
    {
        method: 'get',
        headers,
    }), {
    default: () => [],
    watch: [page, search, pageCount, sort]
})
</script>

<template>
    <UCard class="w-full shadow-lg border-2 dark:bg-gray-800" :ui="{
        base: 'p-4',
        ring: '',
        divide: 'divide-y divide-gray-200 dark:divide-gray-400',
        header: { padding: 'px-4 py-5' },
        body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-400' },
        footer: { padding: 'p-4' }
    }">
        <template #header>
            <h2 class="font-semibold text-center text-4xl text-gray-900 dark:text-white leading-tight">
                Funcionários
            </h2>
        </template>

        <div class="flex w-full items-center gap-4">
            <div class="flex w-full py-3.5 border-b border-gray-200 dark:border-gray-700">
                <UInput v-model="search" placeholder="Filtrar funcionários..." class="w-full"
                    icon="i-heroicons-magnifying-glass-20-solid" size="xl" trailing />
            </div>
            <div>
                <USelectMenu v-model="selectedStatus" :options="filterStatus" placeholder="Status" class="w-40"
                    size="xl" />
            </div>
            <div>
                <UButton icon="i-heroicons-plus-20-solid" size="lg" color="gray" square variant="solid" />
            </div>
        </div>

        <UTable :rows="employees ? employees : undefined" :columns="columns" :ui="{
            divide: 'divide-y divide-gray-300 dark:divide-gray-700',
            tbody: 'divide-y divide-gray-200 dark:divide-gray-500',
        }" v-model:sort="sort" sort-mode="auto" :loading="pending">

            <template #status-header="{ column }">
                <div class="text-center">
                    <span>{{ column.label }}</span>
                </div>
            </template>

            <template #status-data="{ row }">
                <div class="text-center">
                    <UBadge size="xs" :label="row.status ? 'EM SERVIÇO' : 'DESLIGADO'"
                        :color="row.status ? 'green' : 'red'" variant="subtle" />
                </div>
            </template>

            <template #salary-data="{ row }">
                <div class="text">
                    <span>{{ row.salary.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}</span>
                </div>
            </template>

            <template #role-data="{ row }">
                <div class="text-center">
                    <span>{{ row.role }}</span>
                </div>
            </template>
            <template #role-header="{ column }">
                <div class="text-center">
                    <span>{{ column.label }}</span>
                </div>
            </template>

            <template #actions-data="{ row }">
                <div class="text-center">
                    <UDropdown :items="items(row)">
                        <UButton color="gray" variant="soft" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                    </UDropdown>
                </div>
            </template>
        </UTable>

        <template #footer>
            <div class="flex flex-wrap justify-between items-center">
                <div>
                    <span class="text-sm leading-5">
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
    </UCard>
</template>