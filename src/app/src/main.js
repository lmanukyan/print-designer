import { createApp } from "vue";
import App from "./App.vue";
import { Quasar } from "quasar";
import { store } from "@/store";
import quasarUserOptions from "./quasar-user-options";
import { i18n } from "./locales";
import { Context as CanvasContext } from "@/services/canvas";

createApp(App)
  .use(Quasar, quasarUserOptions)
  .use(store)
  .use(i18n)
  .provide("ctx", CanvasContext)
  .mount("#app");
