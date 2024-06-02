<script setup lang="ts">
import type { Employer } from '~/server/interfaces';
import MData from '~/components/employer_modal.vue'
import ViewEmployer from '~/components/view_employer.vue';
import { del } from '~/server/employer_crud';

const columns = [{
    key: 'name',
    label: 'Nome',
    sortable: true
}, {
    key: 'role',
    label: 'Setor'
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

const items = (row: Employer) => [
    [{
        label: 'Atualizar',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => {
            modal.open(MData, {
                type: "UPDATE",
                fields: ModalFields,
                oldEmp: row,
                onSuccess() {
                    toast.add({
                        title: 'Sucesso!',
                        icon: 'i-heroicons-check-badge',
                        color: 'primary',
                        description: 'Funcionário atualizado com sucesso.',
                        id: 'update_success'
                    })
                    // toast.add({
                    //     title: 'Erro!',
                    //     icon: 'i-heroicons-x-circle',
                    //     color: 'red',
                    //     description: 'Algum erro ocorreu.',
                    //     id: 'update_error'
                    // })
                },
                close: modal.close
            })
        }
    }, {
        label: 'Deletar',
        icon: 'i-heroicons-trash-20-solid',
        click: async () => await del(row._id)
    }], [{
        label: 'Ver Mais',
        icon: 'i-heroicons-information-circle-20-solid',
        click: async () => {
            modal.open(ViewEmployer, {
                employer: row,
                close: modal.close
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

const { pending, data: employees } = await useLazyAsyncData<Employer[]>('employees', () => $fetch(`http://localhost:8080/employees?id=ALL`,
    {
        method: 'get',
        headers,
    }), {
    default: () => [],
    watch: [page, pageCount, sort]
})

const filteredRows = computed(() => {
    if (employees) {
        if (!search.value) {
            return employees.value
        }

        return employees.value.filter((employer) => {
            return Object.values(employer).some((value) => {
                return String(value).toLowerCase().includes(search.value.toLowerCase())
            })
        })
    } else return undefined;
})

const ModalFields = [
    {
        label: "Nome",
        name: "name",
        options: {
            text: {
                placeholder: "Digite o nome do funcionário.",
                size: "xl" as "xl",
                color: "gray",
                required: true
            }
        }
    },
    {
        label: "Salário",
        name: "salary",
        options: {
            text: {
                placeholder: "Digite o salário do funcionário.",
                description: "Padrão para números decimais é: 0.00. Exemplo: 2300.23",
                size: "xl" as "xl",
                color: "gray",
                required: true
            }
        }
    },
    {
        label: "Setor",
        name: "role",
        options: {
            select_menu: {
                placeholder: "Selecione um setor",
                options: [
                    "Desenvolvimento",
                    "Recursos Humanos",
                    "Administração"
                ],
                required: true
            }
        }
    },
    {
        label: "Em Serviço?",
        name: "status",
        options: {
            checkbox: {
                required: true
            }
        }
    },
    {
        label: "Foto",
        name: "photo",
        options: {
            image: {
                types: [
                    "image/webp",
                    "image/jpeg",
                    "image/jpg",
                    "image/png"
                ],
                description: "Tipos surpotados: .png, .webp, .jpeg, .jpg.",
                required: false
            }
        }
    }
]

const modal = useModal()
const toast = useToast()

function openCreate() {
    modal.open(MData, {
        type: "CREATE",
        fields: ModalFields,
        onSuccess() {
            toast.add({
                title: 'Sucesso!',
                icon: 'i-heroicons-check-badge',
                color: 'primary',
                description: 'Funcionário criado com sucesso.',
                id: 'create_success'
            })
            // toast.add({
            //     title: 'Erro!',
            //     icon: 'i-heroicons-x-circle',
            //     color: 'red',
            //     description: 'Algum erro ocorreu.',
            //     id: 'create_error'
            // })
        },
        close: modal.close
    })
}

</script>

<template>
    <div class="p-4">
        <h2 class="font-semibold text-center text-4xl text-gray-900 dark:text-white leading-tight">
            Funcionários
        </h2>
    </div>
    <div>
        <div class="flex w-full items-center gap-4 border-b">
            <div class="flex w-full py-3.5 border-gray-200 dark:border-gray-700">
                <UInput v-model="search" placeholder="Pesquisar funcionário..." class="w-full"
                    icon="i-heroicons-magnifying-glass-20-solid" size="xl" trailing />
            </div>
            <div>
                <USelectMenu v-model="selectedStatus" :options="filterStatus" placeholder="Status" class="w-40"
                    size="xl" />
            </div>
            <div>
                <UButton icon="i-heroicons-user-plus-20-solid" size="lg" color="gray" square variant="solid"
                    @click="openCreate" />
            </div>
        </div>

        <UTable :rows="filteredRows" :columns="columns" :ui="{
            divide: 'divide-y divide-gray-300 dark:divide-gray-700',
            tbody: 'divide-y divide-gray-200 dark:divide-gray-500',
            base: 'w-full',
            emptyState: {
                icon: 'w-10 h-10 mx-auto text-gray-400 dark:text-gray-500 mb-4'
            }
        }" v-model:sort="sort" sort-mode="auto" :loading="pending"
            :empty-state="{ icon: 'i-heroicons-user-group-20-solid', label: 'Nenhum funcionário encontrado.' }">

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
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                    </UDropdown>
                </div>
            </template>
        </UTable>

        <div class="flex justify-between items-center w-full mt-4 px-2">
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

            <div>
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
        </div>
    </div>
</template>