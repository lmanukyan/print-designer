<template>
  <div class="q-pa-md">
    <template v-if="selectedLayer.layerId">

      <q-btn-group push spread>
        <q-btn push icon="vertical_align_center" @click="selectedLayer.centerH()" class="icon-rotate-90">
          <q-tooltip class="bg-purple text-body2" anchor="top middle" self="bottom middle" :offset="[10, 10]">Центрировать по вертикали</q-tooltip>
        </q-btn>
        <q-btn push icon="vertical_align_center" @click="selectedLayer.centerV()">
          <q-tooltip class="bg-purple text-body2" anchor="top middle" self="bottom middle" :offset="[10, 10]">Центрировать по горизонтали</q-tooltip>
        </q-btn>
        <q-btn push icon="flip" @click="setBoolProp('flipX')">
          <q-tooltip class="bg-purple text-body2" anchor="top middle" self="bottom middle" :offset="[10, 10]">Отразить по горизонтали</q-tooltip>
        </q-btn>
        <q-btn push icon="flip" @click="setBoolProp('flipY')" class="icon-rotate-90">
          <q-tooltip class="bg-purple text-body2" anchor="top middle" self="bottom middle" :offset="[10, 10]">Отразить по вертикали</q-tooltip>
        </q-btn>
        <q-btn push icon="move_up" @click="bringToFront">
          <q-tooltip class="bg-purple text-body2" anchor="top middle" self="bottom middle" :offset="[10, 10]">Слой вверх</q-tooltip>
        </q-btn>
        <q-btn push icon="move_up" @click="sendToBack" class="icon-rotate-180">
          <q-tooltip class="bg-purple text-body2" anchor="top middle" self="bottom middle" :offset="[10, 10]">Слой вниз</q-tooltip>
        </q-btn>
      </q-btn-group>

      <p class="text-subtitle1 q-pt-md q-pb-md">Поворот</p>
      <q-slider
        v-model="selectedLayer.angle"
        :min="0"
        :max="360"
        :step="1"
        label
        label-always
        color="primary"
      />

      <template v-if="selectedLayer.layerType == 'text'">

        <p class="text-subtitle1 q-pb-md">Размер</p>
        <q-slider
          v-model="selectedLayer.fontSize"
          :min="10"
          :max="200"
          :step="1"
          label
          label-always
          color="primary"
        />

        <p class="text-subtitle1">Текст</p>
        <q-input
          filled
          v-model="selectedLayer.text"
          type="textarea"
          input-class="layer-text-field"
        />

        <p class="text-subtitle1 q-mt-md">Стиль</p>
        <q-btn-group push spread>
          <q-btn push icon="format_bold" @click="setBold" :class="{ 'bg-primary text-white': isBold() }" />
          <q-btn push icon="format_italic" @click="setItalic" :class="{ 'bg-primary text-white': isItalic() }" />
          <q-btn push icon="format_underlined" @click="setBoolProp('underline')" :class="{ 'bg-primary text-white': selectedLayer.underline }" />
        </q-btn-group>

        <p class="text-subtitle1 q-mt-md">Фонт</p>
        <q-select filled v-model="selectedLayer.fontFamily" :options="['Roboto', ...fonts]" />

        <q-color v-model="selectedLayer.fill" no-header-tabs no-footer class="q-mt-md" />

    </template>
    
    <template v-if="selectedLayer.layerType == 'image'">
      <q-list bordered separator dense>
        <q-item-label header>Фильтры</q-item-label>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Grayscale</q-item-label>
          </q-item-section>
          <q-item-section side >
            <q-toggle color="blue" v-model="grayscale" />
          </q-item-section>
        </q-item>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Sepia</q-item-label>
          </q-item-section>
          <q-item-section side >
            <q-toggle color="blue" v-model="sepia" />
          </q-item-section>
        </q-item>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Invert</q-item-label>
          </q-item-section>
          <q-item-section side >
            <q-toggle color="blue" v-model="invert" />
          </q-item-section>
        </q-item>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Black/White</q-item-label>
          </q-item-section>
          <q-item-section side >
            <q-toggle color="blue" v-model="blackwhite" />
          </q-item-section>
        </q-item>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Brownie</q-item-label>
          </q-item-section>
          <q-item-section side >
            <q-toggle color="blue" v-model="brownie" />
          </q-item-section>
        </q-item>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Vintage</q-item-label>
          </q-item-section>
          <q-item-section side >
            <q-toggle color="blue" v-model="vintage" />
          </q-item-section>
        </q-item>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Polaroid</q-item-label>
          </q-item-section>
          <q-item-section side >
            <q-toggle color="blue" v-model="polaroid" />
          </q-item-section>
        </q-item>
      </q-list>
    </template>

  </template>

  <template v-else>
    <p class="text-subtitle1">Выберите объект для редактирования его параметров</p>
  </template>
  
  
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { AvailableFontFamilies } from '@/WebFontConfig'

import CanvasService from '@/services/canvas'

export default {
  name: 'ObjectDetails',

  inject: ['ctx'],
  
  data: () => ({
    fonts: AvailableFontFamilies,
  }),

  computed: {
    ...mapState('canvas', [
      'selectedLayer'
    ]),
    grayscale: CanvasService.filter('Grayscale'),
    sepia: CanvasService.filter('Sepia'),
    invert: CanvasService.filter('Invert'),
    blackwhite: CanvasService.filter('BlackWhite'),
    brownie: CanvasService.filter('Brownie'),
    vintage: CanvasService.filter('Vintage'),
    polaroid: CanvasService.filter('Polaroid'),
  },

  watch: {
    selectedLayer: {
      handler(){
        if( this.ctx.canvas.getActiveObject() ){
          this.ctx.canvas.getActiveObject().dirty = true;
          this.ctx.canvas.renderAll();
        }
      },
      deep: true
    },
  },

  methods: {
    isBold(){
      return this.selectedLayer.fontWeight == 'bold';
    },
    isItalic(){
      return this.selectedLayer.fontStyle == 'italic';
    },
    setBold(){
      if( this.ctx.canvas.getActiveObject() ){
        this.selectedLayer.fontWeight = this.isBold() ? 'normal' : 'bold'; 
      }
    },
    setItalic(){
      if( this.ctx.canvas.getActiveObject() ){
        this.selectedLayer.fontStyle = this.isItalic() ? 'normal' : 'italic'; 
      }
    },
    setBoolProp(prop){
      if( this.ctx.canvas.getActiveObject() ){
        this.selectedLayer[prop] = ! this.selectedLayer[prop]; 
      }
    },
    bringToFront(){
      this.ctx.canvas.bringToFront(this.ctx.canvas.getActiveObject());
      this.ctx.canvas.renderAll();
    },
    sendToBack(){
      this.ctx.canvas.sendToBack(this.ctx.canvas.getActiveObject());
      this.ctx.canvas.renderAll();
    }
  }

}
</script>

<style lang="scss">
.icon-rotate-90 i{
  transform: rotate(90deg) !important;
}
.icon-rotate-180 i{
  transform: rotate(180deg) !important;
}
</style>
