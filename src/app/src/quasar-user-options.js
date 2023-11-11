import "./styles/quasar.sass";
import "@quasar/extras/material-icons/material-icons.css";

import { Notify } from "quasar";

Notify.registerType("error", {
  color: "negative",
  icon: "error",
});

Notify.registerType("success", {
  color: "positive",
  icon: "check_circle",
});

Notify.registerType("orderSuccess", {
  color: "positive",
  position: "center",
});

// To be used on app.use(Quasar, { ... })
export default {
  plugins: {
    Notify,
  },
  config: {
    notify: {
      position: "top-right",
      timeout: 2500,
      progress: true,
    },
  },
};
