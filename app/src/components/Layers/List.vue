<template>
  <div class="q-pb-md q-px-2">
    <q-btn
      no-caps
      @click="addTextLayer"
      color="white"
      text-color="black"
      icon="add"
      :label="$t('label.text')"
      class="q-mr-sm"
    />
    <q-btn
      no-caps
      @click="this.$refs.fileInput.click()"
      color="primary"
      icon="file_upload"
      :label="$t('label.image')"
    />
    <input
      ref="fileInput"
      type="file"
      @change="uploadImage"
      accept="image/*"
      class="hidden"
    />
  </div>

  <q-list bordered separator class="scroll-area">
    <template v-for="layer in layers" :key="layer.layerId">
      <LayerItem :layer="layer" v-if="layer.mode == mode" />
    </template>
    <LoadingItem v-if="loadingLayer" />
    <q-separator v-show="layers.length" />
  </q-list>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";

import CanvasService from "@/services/canvas";
import MediaService from "@/services/media";

import LayerItem from "@/components/Layers/Item";
import LoadingItem from "@/components/Layers/Loading";

export default {
  name: "LayersList",

  components: {
    LayerItem,
    LoadingItem,
  },

  data: () => ({
    tab: "layers",
    loadingLayer: false,
  }),

  computed: {
    ...mapState("canvas", ["layers", "mode"]),
  },

  methods: {
    ...mapMutations("app", ["pushUploadedImage"]),

    addTextLayer() {
      CanvasService.addTextLayer();
    },

    addImageLayer(url) {
      CanvasService.addImageLayer(url);
    },

    async uploadImage(e) {
      let file = e.target.files[0];

      if (!file) {
        return;
      }

      this.loadingLayer = true;

      let data = new FormData();
      data.append("file", file);

      let image = await MediaService.upload(data);
      if (image) {
        this.addImageLayer(image.url);
        this.pushUploadedImage({
          id: Date.now(),
          url: image.url,
        });
      }
      this.loadingLayer = false;
    },
  },
};
</script>

<style lang="scss">
.scroll-area {
  @media (max-width: $breakpoint-xs) {
    min-height: 100px;
  }
}
</style>
