<template>
  <q-dialog
    v-model="dialog"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-white text-black text-white">
      <q-bar class="bg-primary text-white">
        <q-space />
        <q-btn dense flat icon="close" v-close-popup @click="reset" />
      </q-bar>

      <q-card-section>
        <div class="q-pa-md">
          <q-form @submit="onSubmit">
            <div class="row justify-center q-mb-lg">
              <div class="col-4 col-xs-8">
                <q-input
                  v-model="title"
                  type="text"
                  class="full-width"
                  filled
                  :label="$t('label.title')"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || $t('text.error.emptyTitle'),
                  ]"
                />
              </div>
            </div>

            <div class="row justify-center q-gutter-md">
              <div class="col-xs-12 col-sm-4">
                <q-card class="my-card">
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        {{ $t("label.frontSide") }}
                        <span class="text-negative"
                          >({{ $t("label.required") }})</span
                        >
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <div class="custom-model-image" v-if="front?.id">
                    <img :src="front.url" />
                  </div>
                  <q-skeleton v-else height="200px" square />

                  <q-card-actions align="center">
                    <input
                      ref="frontImage"
                      type="file"
                      @change="uploadImage('front', $event)"
                      accept="image/*"
                      class="hidden"
                    />
                    <q-btn
                      @click="this.$refs.frontImage.click()"
                      color="accent"
                      text-color="purple"
                      no-caps
                    >
                      {{ $t("label.select") }}
                    </q-btn>
                  </q-card-actions>
                </q-card>
              </div>
              <div class="col-xs-12 col-sm-4">
                <q-card class="my-card">
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        {{ $t("label.backSide") }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <div class="custom-model-image" v-if="back?.id">
                    <img :src="back.url" />
                  </div>
                  <q-skeleton v-else height="200px" square />

                  <q-card-actions align="center">
                    <input
                      ref="backImage"
                      type="file"
                      @change="uploadImage('back', $event)"
                      accept="image/*"
                      class="hidden"
                    />
                    <q-btn
                      @click="this.$refs.backImage.click()"
                      color="accent"
                      text-color="purple"
                      no-caps
                    >
                      {{ $t("label.select") }}
                    </q-btn>
                  </q-card-actions>
                </q-card>
              </div>
            </div>

            <div class="row justify-center q-mt-lg">
              <q-btn
                :loading="loading"
                :label="$t('label.create')"
                type="submit"
                color="primary"
                no-caps
              />
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";

import MediaService from "@/services/media";
import ProductService from "@/services/product";

export default {
  name: "CustomProductModal",

  data: () => ({
    loading: false,

    title: "",
    front: {},
    back: {},
  }),

  computed: {
    ...mapState("app", ["customProductModalOpened"]),
    dialog: {
      get() {
        return this.customProductModalOpened;
      },
      set(value) {
        this.setCustomProductModalOpened(value);
      },
    },
  },

  methods: {
    ...mapMutations("product", ["pushModel"]),
    ...mapMutations("app", [
      "setCatalogModalOpened",
      "setCustomProductModalOpened",
    ]),

    reset() {
      this.title = "";
      this.front = {};
      this.back = {};
    },

    async onSubmit() {
      if (!this.front.id) {
        return;
      }

      let product = await ProductService.create({
        title: this.title,
        clientModel: true,
        images: [
          {
            front: this.front.id,
            back: this.back?.id,
          },
        ],
      });

      if (product) {
        this.pushModel(product);
        this.setCustomProductModalOpened(false);
        this.setCatalogModalOpened(true);
        this.reset();
      }
    },

    async uploadImage(mode, e) {
      console.log(mode);

      let file = e.target.files[0];

      if (!file) {
        return;
      }

      this.loadingLayer = true;

      let data = new FormData();
      data.append("file", file);

      let image = await MediaService.upload(data);

      if (image) {
        this[mode] = image;
      }
    },
  },
};
</script>

<style lang="scss">
.custom-model-image {
  display: flex;
  width: 100%;
  height: 200px;
  align-items: center;
  justify-content: center;

  img {
    height: 100%;
    width: auto;
    max-width: 400px;
  }
}
</style>
