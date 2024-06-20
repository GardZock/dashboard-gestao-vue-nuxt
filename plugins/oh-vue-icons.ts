import { OhVueIcon, addIcons } from "oh-vue-icons";
import { CoSearch } from "oh-vue-icons/icons";

addIcons(CoSearch);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("v-icon", OhVueIcon);
});