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
  <div>
    <div class="flex flex-col min-h-[100vh] w-full">
      <Nav />
      <NuxtPage page-key="static" class="grow" />
      <Footer />
    </div>
    <UModals />
    <UNotifications />
  </div>
</template>
