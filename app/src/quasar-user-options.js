
import './styles/quasar.sass'
import '@quasar/extras/material-icons/material-icons.css'

import { Notify } from 'quasar'

Notify.registerType('error', {
  color: 'negative',
});

Notify.registerType('success', {
  color: 'positive',
});

Notify.registerType('orderSuccess', {
  color: 'positive',
  position: 'center'
});

// To be used on app.use(Quasar, { ... })
export default {
  plugins: {
    Notify
  },
  config: {
    notify: {
      position: 'bottom-right',
      timeout: 2000
    }
  },
}