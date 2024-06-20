<script setup lang="ts">
const links = [
    [{
        label: 'Home',
        icon: 'i-heroicons-home',
        to: '/dashboard'
    }, {
        label: 'Produtos',
        icon: 'i-heroicons-shopping-cart',
        to: '/dashboard/products'
    }, {
        label: 'Funcionários',
        icon: 'i-heroicons-user',
        to: `/dashboard/employees`
    }], [{
        label: 'Configurações',
        icon: 'i-heroicons-cog-6-tooth',
        to: '/dashboard/settings'
    }]
]
</script>

<template>
    <UVerticalNavigation :links="links" :ui="{
        base: 'text-[18px]',
        icon: {
            base: 'w-6 h-6'
        }
    }" />
</template>