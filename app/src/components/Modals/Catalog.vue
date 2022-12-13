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
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>

      <q-card-section>

        <h4 class="text-center q-mt-lg">Выберите продукт</h4>

        <div class="grid-4">
          <q-card
            v-for="model in models"
            :key="model.name"
            class="col-lg-3 col-md-4 col-sm-6 col-xs-12"
          >
            <q-card-section>
              <div class="text-h6">{{ model.title }}</div>
            </q-card-section>
            <div class="catalog-image">
              <img :src="model.images[0].front.url" />
            </div>
            <q-card-actions align="center">
              <q-btn color="primary" @click="changeModel(model)">
                Выбрать
              </q-btn>
              <q-btn
                v-if="canDelete(model)"
                @click="deleteModelById(model.id)"
                color="negative"
              >
                Удалить
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";

import ProductService from "@/services/product";

export default {
  name: "CatalogModal",

  computed: {
    ...mapState("app", ["user", "catalogModalOpened"]),
    ...mapState("product", ["models"]),
    dialog: {
      get() {
        return this.catalogModalOpened;
      },
      set(value) {
        this.setCatalogModalOpened(value);
      },
    },
  },

  methods: {
    ...mapMutations("app", ["setCatalogModalOpened"]),
    ...mapMutations("product", ["deleteModel", "setSelectedModel"]),

    canDelete(model) {
      let author =
        typeof model.author === "string" ? model.author : model.author.id;
      return model.clientModel && author == this.user?.id;
    },

    changeModel(model) {
      this.setSelectedModel(model);
      this.setCatalogModalOpened(false);
    },

    async deleteModelById(id) {
      let result = await ProductService.delete(id);
      if (result) {
        this.deleteModel({ id });
      }
    },
  },
};
</script>

<style lang="scss">
.catalog-image {
  display: flex;
  width: 100%;
  height: 200px;
  align-items: center;
  justify-content: center;

  img {
    height: 100%;
    width: auto;
    max-width: 300px;
  }
}
</style>
