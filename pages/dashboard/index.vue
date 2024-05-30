<script setup lang="ts">
import DashNav from '~/components/dashboard_nav.vue';
import Sales from '~/components/sales.vue'

</script>

<template>
    <div class="flex">
        <div class="w-[15%] border-r">
            <DashNav />
        </div>
        <div class="w-full">
            <Sales />
        </div>
    </div>
</template>