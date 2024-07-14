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

<style>
body::-webkit-scrollbar {
  width: 12px;
}

body::-webkit-scrollbar-track {
  background: rgb(164, 164, 164);
}

body::-webkit-scrollbar-thumb {
  background-color: rgb(112, 112, 112);
  border-radius: 20px;
}
</style>