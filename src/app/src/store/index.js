import { createStore } from 'vuex'

import app from '@/store/app'
import order from '@/store/order'
import canvas from '@/store/canvas'
import product from '@/store/product'

export const store = createStore({
  modules: {
    app,
    order,
    canvas,
    product
  }
})