<script setup lang="ts">
import useColorMode from './useColor.vue';
</script>

<template>
    <nav class="flex justify-between p-4 items-center border-b border-gray-300 pb-5">
        <div>
            <a href="/"><img class="w-[150px] pointer-events-none" src="~/public/logo.webp" alt="Logo"></a>
        </div>
        <div>
            <ul class="list-none flex items-center">
                <li class="text-center p-2"><a href="/dashboard" class="text-lg text-dark dark:text-white no-underline">DashBoard</a></li>
                <li class="text-center p-2"><useColorMode/></li>
            </ul>
        </div>
    </nav>
</template>
