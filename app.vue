<script setup lang="ts">
const appConfig = useAppConfig()
import Nav from './components/nav.vue';
import Footer from './components/footer.vue';
useHead({
  title: 'CRUD - App',
  meta: [
    { name: 'description', content: 'A CRUD site.' }
  ]
})
</script>

<template>
  <div class="flex flex-col min-h-[100vh]">
    <Nav />
    <NuxtPage page-key="static" class="grow" />
    <Footer />
  </div>
</template>
