export default {

  namespaced: true,

  state () {
    return {
      pricing: {},
      price: 0,
      quality: {label: 'тонкий', value: 'thin'},
      sizes: {
        xs: 0, s: 0, m: 0,
        l: 0, xl: 0, xxl: 0,
      },
      urgency: false,
    }
  },
  
  mutations: {
    setPrice (state, payload) {
      state.price = payload
    },
    setPricing (state, payload) {
      state.pricing = payload
    },
    setQuality (state, payload) {
      state.quality = payload
      this.dispatch('order/calculatePrice')
    },
    setUrgency (state, payload) {
      state.urgency = payload
      this.dispatch('order/calculatePrice')
    },
  },

  getters: {
    quantity(state, getters, rootState){
      if(rootState.product.selectedModel.clientModel){
        return 1
      }
      return Object.values(state.sizes).reduce(
        (a, b) => parseInt(a) + parseInt(b), 0
      );
    },

  },

  actions: {
    calculatePrice({ state, getters, commit, rootState }){
      let productPrice = 0;
      let quantity = getters.quantity;
      let layersCount = rootState.canvas.layers.length;
      let selectedModel = rootState.product.selectedModel;

      if(! selectedModel.clientModel){
        if( quantity > getPricingMaxQty(selectedModel.prices) ){
          commit('setPrice', 'по соглашению')
          return;
        }
        productPrice = getPriceByQty(selectedModel.prices, quantity)
      }

      if( layersCount > getPricingMaxQty(state.pricing.prices) ){
        commit('setPrice', 'по соглашению')
        return;
      }

      let layersPrice = getPriceByQty(state.pricing.prices, layersCount) * layersCount

      let qualityPercentage = state.pricing.quality[state.quality.value]

      if(qualityPercentage > 0){
        productPrice = (qualityPercentage * productPrice) / 100 + productPrice
      }

      let finalPrice = (productPrice + layersPrice) * quantity;
      
      if(state.urgency){
        finalPrice = (state.pricing.urgency * finalPrice) / 100 + finalPrice
      }

      finalPrice = Math.round(finalPrice)

      commit('setPrice', finalPrice)
    },
  }
  
}

const getPriceByQty = (prices = [], qty) => {
  let matchedPrice = prices.filter(
    (item) => item.from <= qty && item.to >= qty  
  )
  return matchedPrice.length > 0 ? matchedPrice[0].value : 0;
}

const getPricingMaxQty = (prices = []) => {
  return prices.length > 0 ? prices[prices.length - 1].to : 0;
}