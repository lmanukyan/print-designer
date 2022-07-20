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
          <div class="col">
            <LayersPanel />
          </div>
          <div class="col-6">
            <div class="canvas-designer">
              <ModeSelector />
              <div class="flex flex-center">
                <canvas ref="canvas"></canvas>
              </div>
            </div>
          </div>
          <div class="col">
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
        this.loadProductModels(null);
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
      console.log(models);
      this.setModels(models);
    },

    async logout() {
      await UserService.logout();
      window.location.reload();
    },
  },
};
</script>
