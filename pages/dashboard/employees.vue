<script setup lang="ts">
import DashNav from '~/components/dashboard_nav.vue';
import Employees from '~/components/employer.vue';
</script>

<template>
    <div class="flex">
        <div class="w-[15%] border-r">
            <DashNav />
        </div>
        <div class="flex w-full">
            <div class="w-full px-2">
                <Employees />
            </div>
        </div>
    </div>
</template>