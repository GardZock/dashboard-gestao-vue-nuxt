<script setup lang="ts">
import type { Product } from '~/server/interfaces';
import MData from '~/components/product/product.modal.vue'
import ViewProduct from '~/components/product/view_product.vue';
import { del } from '~/server/product_crud';

const columns = [{
    key: 'name',
    label: 'Nome',
    sortable: true,
    direction: 'asc' as const
}, {
    key: 'normal_price',
    label: 'Preço',
    sortable: true,
    direction: 'asc' as const
}, {
    key: 'disc_price',
    label: 'Preço com Desconto',
    sortable: true,
    direction: 'asc' as const
}, {
    key: 'category',
    label: 'Categoria'
}, {
    key: 'quantity',
    label: 'Quantidade em Estoque',
    sortable: true,
    direction: 'asc' as const
}, {
    key: 'actions'
}]

const items = (row: Product) => [
    [{
        label: 'Atualizar',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => {
            modal.open(MData, {
                type: "UPDATE",
                fields: UModalFields,
                oldProd: row,
                onSuccess() {
                    toast.add({
                        title: 'Sucesso!',
                        icon: 'i-heroicons-check-badge',
                        color: 'primary',
                        description: 'Produto atualizado com sucesso.',
                        id: 'modal-success'
                    })
                    updt.value = !updt.value;
                },
                onError() {
                    toast.add({
                        title: 'Erro!',
                        icon: 'i-heroicons-x-circle',
                        color: 'red',
                        description: 'Algum erro ocorreu.',
                        id: 'modal-error'
                    })
                    updt.value = !updt.value;
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
            modal.open(ViewProduct, {
                product: row,
                close: modal.close
            })
        }
    }]
]

const search = ref('')
const updt: Ref<boolean> = ref(false);

// REQUEST DATA
const headers = new Headers();
headers.append("Content-Type", "application/json")

const { pending, data: products } = await useLazyAsyncData<Product[]>('products', () => $fetch(`http://localhost:8080/products?id=ALL`,
    {
        method: 'get',
        headers,
    }), {
    default: () => [],
    watch: [updt]
})

const filteredRows = computed(() => {
    if (products) {
        if (!search.value) {
            return products.value
        }

        return products.value.filter((product) => {
            return Object.values(product).some((value) => {
                return String(value).toLowerCase().includes(search.value.toLowerCase())
            })
        })
    } else return undefined;
})

const CModalFields = [
    {
        label: "Nome",
        name: "name",
        options: {
            text: {
                placeholder: "Digite o nome do produto.",
                size: "xl" as "xl",
                color: "gray",
                required: true
            }
        }
    },
    {
        label: "Valor",
        name: "normal_price",
        options: {
            text: {
                placeholder: "Digite o valor do produto.",
                description: "Padrão para números decimais é: 0.00. Exemplo: 2300.23",
                size: "xl" as "xl",
                color: "gray",
                required: true
            }
        }
    }, 
    {
        label: "Quantidade em Estoque",
        name: "quantity",
        options: {
            text: {
                placeholder: "Digite a quantiade do produto em estoque.",
                size: "xl" as "xl",
                color: "gray",
                required: true
            }
        }
    },
    {
        label: "Categoria",
        name: "category",
        options: {
            select_menu: {
                placeholder: "Selecione uma categoria",
                options: [
                    "Roupas",
                    "Eletrodomésticos",
                    "Móveis"
                ],
                required: true
            }
        }
    },
    {
        label: "Imamge do Produto",
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

const UModalFields = [
    {
        label: "Nome",
        name: "name",
        options: {
            text: {
                placeholder: "Digite o nome do produto.",
                size: "xl" as "xl",
                color: "gray",
                required: true
            }
        }
    },
    {
        label: "Valor",
        name: "normal_price",
        options: {
            text: {
                placeholder: "Digite o valor do produto.",
                description: "Padrão para números decimais é: 0.00. Exemplo: 2300.23",
                size: "xl" as "xl",
                color: "gray",
                required: true
            }
        }
    },
    {
        label: "Valor com Desconto",
        name: "disc_price",
        options: {
            text: {
                placeholder: "Digite o valor do produto com desconto.",
                description: "Padrão para números decimais é: 0.00. Exemplo: 2300.23",
                size: "xl" as "xl",
                color: "gray",
                required: true
            }
        }
    }, 
    {
        label: "Quantidade em Estoque",
        name: "quantity",
        options: {
            text: {
                placeholder: "Digite a quantiade do produto em estoque.",
                size: "xl" as "xl",
                color: "gray",
                required: true
            }
        }
    },
    {
        label: "Categoria",
        name: "category",
        options: {
            select_menu: {
                placeholder: "Selecione uma categoria",
                options: [
                    "Roupas",
                    "Eletrodomésticos",
                    "Móveis"
                ],
                required: true
            }
        }
    },
    {
        label: "Imamge do Produto",
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
        fields: CModalFields,
        onSuccess() {
            toast.add({
                title: 'Sucesso!',
                icon: 'i-heroicons-check-badge',
                color: 'primary',
                description: 'Produto criado com sucesso.',
                id: 'modal-success'
            })
            updt.value = !updt.value;
        },
        onError() {
            toast.add({
                title: 'Erro!',
                icon: 'i-heroicons-x-circle',
                color: 'red',
                description: 'Algum erro ocorreu.',
                id: 'modal-error'
            })
            updt.value = !updt.value;
        },
        close: modal.close
    })
}

</script>

<template>
    <div class="p-4">
        <h2 class="font-semibold text-center text-4xl text-gray-900 dark:text-white leading-tight">
            Produtos
        </h2>
    </div>
    <div>
        <div class="flex w-full items-center gap-4 border-b px-4">
            <div class="flex w-full py-3.5 border-gray-200 dark:border-gray-700">
                <UInput v-model="search" placeholder="Pesquisar produto..." class="w-full"
                    icon="i-heroicons-magnifying-glass-20-solid" size="xl" trailing />
            </div>
            <div>
                <UButton icon="i-heroicons-plus-20-solid" size="lg" color="gray" square variant="solid"
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
        }" sort-mode="auto" :loading="pending"
            :empty-state="{ icon: 'i-heroicons-user-group-20-solid', label: 'Nenhum produto encontrado.' }">

            <template #status-header="{ column }">
                <div class="text-center">
                    <span>{{ column.label }}</span>
                </div>
            </template>

            <template #normal_price-data="{ row }">
                <div class="text">
                    <span>{{ row.normal_price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}</span>
                </div>
            </template>

            <template #disc_price-data="{ row }">
                <div class="text">
                    <span>{{ row.disc_price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}</span>
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
    </div>
</template>