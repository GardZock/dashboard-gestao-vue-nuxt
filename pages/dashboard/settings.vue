<script setup lang="ts">
import DashNav from '~/components/dashboard_nav.vue';
definePageMeta({
  title: 'CRUD | Configurações'
})
</script>

<template>
    <div class="flex">
        <div class="w-[15%] border-r">
            <DashNav />
        </div>
        <div class="w-full">
            <h1>configurações</h1>
        </div>
    </div>
</template>