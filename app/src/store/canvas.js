export default {

  namespaced: true,

  state () {
    return {
      mode: 'front',
      layers: [],
      selectedLayer: SelectedLayerInitialProps(),
    }
  },
  
  mutations: {
    setMode (state, payload) {
      state.mode = payload
    },
    syncLayers (state, payload) {
      console.log('syncLayers: ', payload);
      state.layers = payload
      this.dispatch('order/calculatePrice')
    },
    setSelectedLayer (state, payload) {
      state.controlTab = 'object';
      state.selectedLayer = payload
    },
    resetSelectedLayer (state) {
      state.controlTab = 'product';
      state.selectedLayer = SelectedLayerInitialProps()
    },    
  },
  
}

const SelectedLayerInitialProps = () => ({
  layerId: null,
  layerType: null,
  text: null,
  fill: null,
  fontSize: null,
  fontWeight: 'normal',
  fontStyle: 'normal',
  underline: false,
  fontFamily: null,
  angle: 0,
  flipX: false,
  flipY: false,
  scaleAndZoom: 0
});
