export default {

  namespaced: true,

  state () {
    return {
      models: [],
      selectedModel: null,
      selectedModelColor: null,
    }
  },
  
  mutations: {
    setModels (state, payload) {
      state.models = payload
      state.selectedModel = payload[0]
      state.selectedModelColor = state.selectedModel.images[0]
    },
    pushModel (state, payload) {
      state.models.push(payload)
    },
    deleteModel (state, { id }) {
      state.models = state.models.filter(m => m.id != id)
      if(state.selectedModel.id == id){
        this.commit("setModels", state.models)
      }
    },
    setSelectedModel (state, payload) {
      state.selectedModel = payload;
      state.selectedModelColor = state.selectedModel.images[0];
    },
    setSelectedModelColor (state, payload) {
      state.selectedModelColor = payload;
    },    
  },

  getters: {
    selectedModelColorUrl (state, getters, rootState){
      return state.selectedModelColor ? state.selectedModelColor[rootState.canvas.mode].url : null 
    },
  }
  
}