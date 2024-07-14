<script setup lang="ts">
import { countProductsByMonth } from '~/server/countMonthly';
import { getTopSoldProducts } from '~/server/getTopSaled';
import Line from '~/components/line.vue'

import type { Sale } from '~/server/interfaces';

const sales: Sale[] = [
    {
        costumer_name: "João Silva",
        products: [
            {
                id: "p1",
                price: 100.00,
                quantity: 2
            }
        ],
        sellDate: "2024-01-15",
        id: "s1"
    },
    {
        costumer_name: "Maria Oliveira",
        products: [
            {
                id: "p2",
                price: 50.00,
                quantity: 1
            }
        ],
        sellDate: "2024-01-16",
        id: "s2"
    },
    {
        costumer_name: "Carlos Santos",
        products: [
            {
                id: "p3",
                price: 150.00,
                quantity: 3
            }
        ],
        sellDate: "2024-01-17",
        id: "s3"
    },
    {
        costumer_name: "Ana Souza",
        products: [
            {
                id: "p4",
                price: 200.00,
                quantity: 1
            }
        ],
        sellDate: "2024-01-18",
        id: "s4"
    },
    {
        costumer_name: "Pedro Lima",
        products: [
            {
                id: "p5",
                price: 75.00,
                quantity: 4
            }
        ],
        sellDate: "2024-01-19",
        id: "s5"
    },
    {
        costumer_name: "Fernanda Costa",
        products: [
            {
                id: "p6",
                price: 120.00,
                quantity: 2
            }
        ],
        sellDate: "2024-06-20",
        id: "s6"
    },
    {
        costumer_name: "Lucas Pereira",
        products: [
            {
                id: "Produto 2",
                price: 90.00,
                quantity: 5
            }
        ],
        sellDate: "2024-04-21",
        id: "s7"
    },
    {
        costumer_name: "Mariana Nunes",
        products: [
            {
                id: "p8",
                price: 110.00,
                quantity: 1
            },{
                id: "Camera",
                price: 60.00,
                quantity: 6
            }
        ],
        sellDate: "2024-05-22",
        id: "s8"
    },
    {
        costumer_name: "Gustavo Rocha",
        products: [
            {
                id: "p9",
                price: 80.00,
                quantity: 3
            }
        ],
        sellDate: "2024-03-23",
        id: "s9"
    },
    {
        costumer_name: "Renata Almeida",
        products: [
            {
                id: "p10",
                price: 60.00,
                quantity: 2
            },{
                id: "Produto 3",
                price: 60.00,
                quantity: 5
            }
        ],
        sellDate: "2024-02-24",
        id: "s10"
    }
];

function sortSalesByDate(sales: Sale[]): Sale[] {
    return sales.sort((a, b) => new Date(b.sellDate).getTime() - new Date(a.sellDate).getTime());
}

const lastSales = sortSalesByDate(sales).slice(0, 3);
const salesByMonth = countProductsByMonth(sales)
const topSales = getTopSoldProducts(sales)

const data = {
    labels: Object.keys(salesByMonth).reverse(),
    datasets: [
        {
            label: "Vendas",
            backgroundColor: "#36e4305f",
            borderColor: "#36e430",
            data: Object.values(salesByMonth).reverse(),
            fill: true
        }
    ]
}

const options = {
    plugins: {
        legend: {
            display: false
        },
        filler: {
            propagate: true
        }
    },
    responsive: true,
    elements: {
        line: {
            tension: 0.4
        }
    }
}

</script>

<template>
    <div class="flex w-full">
        <div class="w-full p-4">
            <UCard class="shadow-md">
                <template #header>
                    <div>
                        <p class="font-bold">Vendas Mensais</p>
                    </div>
                </template>

                <Line v-if="sales" :data="data" :options="options" height="20%" width="100%" />
                <div v-if="!sales" class="h-[200px] w-full flex justify-center items-center">
                    <h2>Sem dados</h2>
                </div>
            </UCard>
        </div>
    </div>
    <div class="flex w-full">
        <div class="w-1/2 p-4">
            <UCard class="shadow-md">
                <template #header>
                    <div>
                        <p>Últimas vendas</p>
                    </div>
                </template>
                <ul>
                    <li v-for="sale in lastSales" class="flex items-center border-t p-4">
                        <div class="mr-2">
                            <img src="../public/img.jpg" alt="product_img" class="w-[100px] rounded-md">
                        </div>
                        <div class="w-full">
                            <div>
                                <h2 class="flex flex-wrap font-semibold">Cliente: {{ sale.costumer_name }}</h2>
                            </div>
                            <div class="flex w-full justify-between items-center">
                                <p>
                                    Quatidade: {{ sale.products.length }}
                                </p>
                                <div class="flex gap-1 items-center">
                                    <p>
                                    Valor total:
                                </p>
                                <p class="text-green-500">{{ sale.products[0].price.toLocaleString('pt-br', {
                                        style: 'currency',
                                    currency: 'BRL' }) }}</p>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </UCard>
        </div>
        <div class="w-1/2 p-4">
            <UCard class="shadow-md">
                <template #header>
                    <div>
                        <p>Produtos Mais Vendidos</p>
                    </div>
                </template>
                <ul>
                    <li v-for="sale in topSales" class="flex items-center border-t p-4">
                        <div class="mr-2">
                            <img src="../public/img.jpg" alt="product_img" class="w-[100px] rounded-md">
                        </div>
                        <div class="w-full">
                            <div>
                                <h2 class="flex flex-wrap font-semibold">{{ sale.name }}</h2>
                            </div>
                            <div class="flex w-full justify-between items-center">
                                <p>
                                    Quatidade: {{ sale.quantity }}
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
            </UCard>
        </div>
    </div>
</template>