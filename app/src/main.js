import { createApp } from "vue";
import App from "./App.vue";
import { Quasar } from "quasar";
import { store } from "@/store";
import quasarUserOptions from "./quasar-user-options";

import { Context as CanvasContext } from "@/services/canvas";

createApp(App)
  .use(Quasar, quasarUserOptions)
  .use(store)
  .provide("ctx", CanvasContext)
  .mount("#app");
