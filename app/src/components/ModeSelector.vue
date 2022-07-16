<template>
  <div class="q-pa-md row items-start">
    
    <div class="mode-selector" v-if="selectedModelColor">
      <div
        @click="setMode('front')" 
        :class="{active: mode == 'front'}"
        class="selector-item"
      >
        <img :src="selectedModelColor.front.url" alt="">
      </div>
      <div 
        v-if="selectedModelColor.back"
        @click="setMode('back')"
        :class="{active: mode == 'back'}"
        class="selector-item"
      >
        <img :src="selectedModelColor.back.url" alt="">
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'

import CanvasService from '@/services/canvas'

export default {
  name: 'ModeSelector',

  computed: {
    ...mapState('canvas', [
      'mode',
    ]),
    ...mapState('product', [
      'selectedModel',
      'selectedModelColor',
    ]),
  },

  watch: {
    mode(){
      this.changeMode();
    },
    selectedModel(){
      if(typeof this.selectedModelColor.back === 'undefined'){
        this.setMode('front');
      }
    }
  },

  methods: {  
    ...mapMutations('canvas', [
      'setMode'
    ]),

    changeMode(){
      CanvasService.changeMode();
    },
  } 

}
</script>

<style lang="scss">
.mode-selector {
  position: absolute;
  z-index: 9;

  img {
    max-width: 60px;
  }

  .selector-item {
    background: #fff;
    border: 2px solid $grey-4;
    border-radius: 5px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &.active {
      border-color: $primary;
    }
  }
    
}


</style>