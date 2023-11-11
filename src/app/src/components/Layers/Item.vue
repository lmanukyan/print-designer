<template>
  <q-item
    @click="selectLayer(layer)"
    :active="layer.layerId == selectedLayer.layerId"
    active-class="bg-accent text-black-8 active-layer"
    clickable
    v-ripple
  >
    <q-item-section avatar top>
      <q-img
        v-if="layer.layerType == 'image'"
        :src="layer._originalElement?.currentSrc"
        style="height: 34px; max-width: 34px"
      />
      <q-icon v-else name="title" color="black" size="34px" />
    </q-item-section>

    <q-item-section top>
      <q-item-label class="q-mt-sm" v-if="layer.layerType == 'image'">
        {{ $t("label.image") }}
      </q-item-label>
      <q-item-label class="q-mt-sm layer-title" v-else>{{
        layer.text
      }}</q-item-label>
    </q-item-section>

    <q-item-section avatar side>
      <div class="text-black-8 q-gutter-xs">
        <q-btn
          class="text-secondary"
          size="12px"
          flat
          dense
          icon="content_copy"
          @click.stop="duplicateLayer(layer)"
        />
        <q-btn
          class="text-red"
          size="12px"
          flat
          dense
          round
          icon="delete"
          @click.stop="removeLayer(layer)"
        />
      </div>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";

import CanvasService from "@/services/canvas";

export default {
  name: "LayerItem",

  inject: ["ctx"],

  props: ["layer"],

  data: () => ({}),

  computed: {
    ...mapState("canvas", ["selectedLayer"]),
  },

  methods: {
    ...mapMutations("canvas", ["setSelectedLayer"]),

    selectLayer(layer) {
      CanvasService.selectLayer(layer, (active) => {
        this.setSelectedLayer(active);
      });
    },

    removeLayer(layer) {
      CanvasService.removeLayer(layer);
    },

    duplicateLayer(layer) {
      CanvasService.duplicateLayer(layer);
    },
  },
};
</script>

<style lang="scss">
.layer-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 116px;
}
.active-layer {
  color: #000 !important;
}
</style>
