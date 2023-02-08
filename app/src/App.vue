<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title> РТП Принт </q-toolbar-title>

        <div>
          <q-item clickable v-ripple v-if="user">
            <q-avatar color="white" text-color="primary">
              {{ user.name[0] }}
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup @click="logout">
                  <q-item-section>Выйти</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-item>
          <q-btn
            v-else
            @click="setAuthModalOpened(true)"
            no-caps
            color="white"
            text-color="black"
            label="Войти"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding>
        <div class="row">
          <div class="col-md-3 col-sm-12 sm-full-width">
            <LayersPanel />
          </div>
          <div class="col-md-6 col-sm-12 canvas-column ">
            <div class="canvas-designer">
              <ModeSelector />
              <div class="flex flex-center canvas-wrapper">
                <canvas ref="canvas"></canvas>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-12 order-sm-last sm-full-width">
            <ControlsPanel />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>

  <InitModal />
  <AuthModal />
  <CatalogModal />
  <CustomProductModal />
</template>

<script>
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import { fabric } from "fabric";

import UserService from "@/services/user";
import OrderService from "@/services/order";
import CanvasService from "@/services/canvas";
import ProductService from "@/services/product";

import WebFont from "webfontloader";
import WebFontConfig from "@/WebFontConfig";

import LayersPanel from "@/components/Layers/Panel";
import ModeSelector from "@/components/Controls/ModeSelector";
import ControlsPanel from "@/components/Controls/Panel";

import InitModal from "@/components/Modals/Init";
import AuthModal from "@/components/Modals/Auth";
import CatalogModal from "@/components/Modals/Catalog";
import CustomProductModal from "@/components/Modals/CustomProduct";

export default {
  name: "LayoutDefault",

  inject: ["ctx"],

  components: {
    LayersPanel,
    ControlsPanel,
    ModeSelector,
    InitModal,
    AuthModal,
    CatalogModal,
    CustomProductModal,
  },

  mounted() {
    this.loadProfile();
    this.loadPricing();

    const ref = this.$refs.canvas;
    this.ctx.canvas = new fabric.Canvas(ref, {
      selection: false,
      width: 600,
      height: 560,
      allowTouchScrolling: true
    });


    this.ctx.canvas.on("before:selection:cleared", () => {
      this.resetSelectedLayer();
      this.setControlTab("product");
    });

    this.ctx.canvas.on("selection:created", (event) => {
      this.handleSelection(event);
    });

    this.ctx.canvas.on("selection:updated", (event) => {
      this.handleSelection(event);
    });

    this.ctx.canvas.on('object:modified', (event) => {
      if(event.action === 'scale' || event.action === 'rotate'){
        this.selectedLayer.dirty = true;
      }
    });

    this.ctx.canvas.on({
      "object:added": () => this.syncLayers(this.ctx.canvas.getObjects()),
      "object:removed": () => this.syncLayers(this.ctx.canvas.getObjects()),
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Delete" && this.selectedLayer.layerId) {
        if (document.querySelector(".layer-text-field")?.matches(":focus"))
          return;
        CanvasService.removeLayer(this.selectedLayer);
      }
    });

    WebFont.load(WebFontConfig);
  },

  computed: {
    ...mapState("app", ["user"]),
    ...mapState("canvas", ["selectedLayer"]),
    ...mapState("product", ["selectedModelColor"]),
    ...mapGetters("product", ["selectedModelColorUrl"]),
  },

  watch: {
    user(newUser) {
      this.loadProductModels(newUser?.id);
    },
    selectedModelColorUrl(url) {
      if (url) CanvasService.drawSelectedModel();
    },
  },

  methods: {
    ...mapMutations("app", [
      "setUser",
      "setControlTab",
      "setAuthModalOpened",
      "setCatalogModalOpened",
    ]),
    ...mapMutations("order", [
      "setPricing",
    ]),
    ...mapMutations("canvas", [
      "syncLayers",
      "setSelectedLayer",
      "resetSelectedLayer",
    ]),
    ...mapMutations("product", ["setModels"]),

    handleSelection(event) {
      let layer = event.selected[0];
      if (this.selectedLayer.layerId != layer.layerId) {
        this.setSelectedLayer(layer);
        this.setControlTab("object");
      }
    },

    async loadProfile() {
      let user = await UserService.getProfile();
      if (user) {
        this.setUser(user);
      } else {
        await this.loadProductModels(null);
      }
    },

    async loadPricing() {
      let prices = await OrderService.getPrices();
      if (prices) {
        this.setPricing(prices);
      }
    },

    async loadProductModels(userId) {
      let models = await ProductService.getModels(userId);
      this.setModels(models);
    },

    async logout() {
      await UserService.logout();
      window.location.reload();
    },
  },
};
</script>

<style lang="scss">
.canvas-designer {
  box-shadow: 0 0 5px #d9d9d9;
  position: sticky;
  top: 55px;
  @media (min-width: $breakpoint-sm) {
    margin: 0 10px;
  }
  @media (max-width: $breakpoint-sm) {
    padding-top: 50px;
  }
}

.canvas-column {
  width: 100%;
  @media (max-width: $breakpoint-sm) {
    order: -1;
    margin-bottom: 30px;
  }
}
@media (max-width: $breakpoint-xs) {
  .canvas-wrapper {
    width: calc(100vw - 20px);
    overflow: hidden;
  }
  .canvas-container {
    position: relative;
    left: 50%;
    margin-left: -100%;
    margin-top: calc(25% * -0.7);
    margin-bottom: calc(30% * -0.7);
    transform: scale(0.7);
  }
}
</style>