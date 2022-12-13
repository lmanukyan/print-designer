<template>
  <div class="q-px-2">
    <template v-if="selectedLayer.layerId">
      <q-btn-group push spread>
        <q-btn
          push
          icon="vertical_align_center"
          @click="selectedLayer.centerH()"
          class="q-px-none icon-rotate-90"
        >
          <q-tooltip
            class="bg-blue-8 text-body2"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
            >Центрировать по вертикали</q-tooltip
          >
        </q-btn>
        <q-btn
          push
          icon="vertical_align_center"
          @click="selectedLayer.centerV()"
          class="q-px-none"
        >
          <q-tooltip
            class="bg-blue-8 text-body2"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
            >Центрировать по горизонтали</q-tooltip
          >
        </q-btn>
        <q-btn push icon="flip" @click="setBoolProp('flipX')" class="q-px-none">
          <q-tooltip
            class="bg-blue-8 text-body2"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
            >Отразить по горизонтали</q-tooltip
          >
        </q-btn>
        <q-btn
          push
          icon="flip"
          @click="setBoolProp('flipY')"
          class="q-px-none icon-rotate-90"
        >
          <q-tooltip
            class="bg-blue-8 text-body2"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
            >Отразить по вертикали</q-tooltip
          >
        </q-btn>
        <q-btn push icon="move_up" @click="bringToFront" class="q-px-none">
          <q-tooltip
            class="bg-blue-8 text-body2"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
            >Слой вверх</q-tooltip
          >
        </q-btn>
        <q-btn
          push
          icon="move_up"
          @click="sendToBack"
          class="q-px-none icon-rotate-180"
        >
          <q-tooltip
            class="bg-blue-8 text-body2"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
            >Слой вниз</q-tooltip
          >
        </q-btn>
      </q-btn-group>

      <p class="text-subtitle1 q-pt-md q-pb-md">Поворот</p>
      <div class="q-px-sm">
        <q-slider
          v-model="selectedLayer.angle"
          :min="0"
          :max="360"
          :step="1"
          label
          label-always
          :markers="90"
          :marker-labels="[
            { value: 0, label: '0' },
            { value: 90, label: '90' },
            { value: 180, label: '180' },
            { value: 270, label: '270' },
            { value: 360, label: '360' },
          ]"
          color="primary"
        >
        <template v-slot:marker-label-group="scope">
          <div class="slider-markers">
            <div
              v-for="marker in scope.markerList"
              :key="marker.index"
              :class="`marker-${marker.value}`"
              @click="selectedLayer.angle = marker.value"
            >
              {{ marker.value }}
            </div>
          </div>
        </template>
        </q-slider>
      </div>

      <template v-if="selectedLayer.layerType == 'text'">
        <p class="text-subtitle1 q-pb-md">Размер</p>
        <div class="q-px-sm">
          <q-slider
            v-model="scale"
            :min="0"
            :max="5"
            :step="0.1"
            label
            label-always
            :label-value="getFontSize()"
            color="primary"
          />
        </div>

        <p class="text-subtitle1">Текст</p>
        <q-input
          filled
          v-model="selectedLayer.text"
          type="textarea"
          input-class="layer-text-field"
        />

        <p class="text-subtitle1 q-mt-md">Стиль</p>
        <q-btn-group push spread>
          <q-btn
            push
            icon="format_bold"
            @click="setBold"
            :class="{ 'bg-primary text-white': isBold() }"
          />
          <q-btn
            push
            icon="format_italic"
            @click="setItalic"
            :class="{ 'bg-primary text-white': isItalic() }"
          />
          <q-btn
            push
            icon="format_underlined"
            @click="setBoolProp('underline')"
            :class="{ 'bg-primary text-white': selectedLayer.underline }"
          />
        </q-btn-group>

        <p class="text-subtitle1 q-mt-md">Фонт</p>
        <q-select
          filled
          v-model="selectedLayer.fontFamily"
          :options="['Roboto', ...fonts]"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label :style="{ 'font-family': scope.label }">
                  {{ scope.label }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-color
          v-model="selectedLayer.fill"
          no-header-tabs
          no-footer
          class="q-mt-md color-picker"
        />
      </template>

    </template>

    <template v-else>
      <p class="text-subtitle1">
        Выберите объект для редактирования его параметров
      </p>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { AvailableFontFamilies } from "@/WebFontConfig";

import CanvasService from "@/services/canvas";

export default {
  name: "ObjectDetails",

  inject: ["ctx"],

  data: () => ({
    fonts: AvailableFontFamilies,
    scale: 1,
  }),

  computed: {
    ...mapState("canvas", ["selectedLayer"]),
    grayscale: CanvasService.filter("Grayscale"),
    sepia: CanvasService.filter("Sepia"),
    invert: CanvasService.filter("Invert"),
    blackwhite: CanvasService.filter("BlackWhite"),
    brownie: CanvasService.filter("Brownie"),
    vintage: CanvasService.filter("Vintage"),
    polaroid: CanvasService.filter("Polaroid"),
  },

  watch: {
    selectedLayer: {
      handler() {
        this.scale = this.selectedLayer.scaleX;
        this.selectedLayer.angle = parseInt(this.selectedLayer.angle);

        if (this.ctx.canvas.getActiveObject()) {
          this.ctx.canvas.getActiveObject().dirty = true;
          this.ctx.canvas.renderAll();
        }
      },
      deep: true,
    },
    scale(newScale) {
      this.selectedLayer.scaleX = newScale;
      this.selectedLayer.scaleY = newScale;
    },
  },

  methods: {
    isBold() {
      return this.selectedLayer.fontWeight == "bold";
    },
    isItalic() {
      return this.selectedLayer.fontStyle == "italic";
    },
    setBold() {
      if (this.ctx.canvas.getActiveObject()) {
        this.selectedLayer.fontWeight = this.isBold() ? "normal" : "bold";
      }
    },
    setItalic() {
      if (this.ctx.canvas.getActiveObject()) {
        this.selectedLayer.fontStyle = this.isItalic() ? "normal" : "italic";
      }
    },
    setBoolProp(prop) {
      if (this.ctx.canvas.getActiveObject()) {
        this.selectedLayer[prop] = !this.selectedLayer[prop];
      }
    },
    bringToFront() {
      this.ctx.canvas.bringToFront(this.ctx.canvas.getActiveObject());
      this.ctx.canvas.renderAll();
    },
    sendToBack() {
      this.ctx.canvas.sendToBack(this.ctx.canvas.getActiveObject());
      this.ctx.canvas.renderAll();
    },
    getFontSize() {
      return (
        parseInt(
          this.ctx.canvas.getActiveObject().scaleX * CanvasService.fontSize
        ) + "px"
      );
    },
  },
};
</script>

<style lang="scss">
.icon-rotate-90 i {
  transform: rotate(90deg) !important;
}
.icon-rotate-180 i {
  transform: rotate(180deg) !important;
}
.color-picker {
  max-width: 100% !important;
}
.slider-markers {
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      position: relative;
      cursor: pointer;
      font-size: 11px;
    }
    .marker-0 {
        left: -1px;
    }
    .marker-90 {
        left: 7px;
    }
    .marker-180 {
        left: 11px;
    }
    .marker-270 {
        left: 11px;
    }
    .marker-360 {
        left: 10px;
    }
}
</style>
