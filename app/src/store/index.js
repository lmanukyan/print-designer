import { createStore } from 'vuex'

import app from '@/store/app'
import canvas from '@/store/canvas'
import product from '@/store/product'

export const store = createStore({
  modules: {
    app,
    canvas,
    product
  }
})