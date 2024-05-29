<script setup lang="ts">
const appConfig = useAppConfig()
import Nav from './components/nav.vue';
useHead({
  title: 'CRUD - App',
  meta: [
    { name: 'description', content: 'A CRUD site.' }
  ]
})
</script>

<template>
  <Nav/>
  <NuxtPage page-key="static" />
</template>
