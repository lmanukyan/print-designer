<template>
  <div class="q-pb-md q-px-2">
    <q-btn
      @click="setCatalogModalOpened(true)"
      no-caps
      color="white"
      icon="shopping_bag"
      text-color="black"
      :label="$t('label.catalog')"
      class="q-mr-sm"
    />
    <q-btn
      @click="makeCustomModel()"
      no-caps
      color="primary"
      icon="add"
      :label="$t('label.createOwn')"
    />
  </div>

  <q-card class="q-mx-2" v-if="selectedModel">
    <q-card-section>
      <div class="text-h6">{{ selectedModel.title }}</div>
    </q-card-section>

    <q-card-section>
      <p class="text-subtitle1">{{ $t("label.color") }}</p>
      <q-card-actions>
        <div
          v-for="image in selectedModel.images"
          :key="image.front.url"
          @click="setSelectedModelColor(image)"
          class="cursor-pointer model-colors"
          :class="{ 'selected-model': selectedModelColor.id == image.id }"
        >
          <q-icon
            v-if="selectedModelColor.id == image.id"
            name="check"
            size="34px"
          />
          <img :src="image.front.url" />
        </div>
      </q-card-actions>

      <q-item tag="label">
        <q-item-section>
          <q-item-label>{{ $t("label.price") }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <span class="text-bold"
            >{{ price }} {{ !isNaN(Number(price)) ? "₽" : "" }}</span
          >
        </q-item-section>
      </q-item>

      <template v-if="!selectedModel.clientModel">
        <q-list separator dense class="q-pa-md">
          <q-item class="text-bold no-padding">
            <q-item-section>
              {{ $t("label.size") }}
            </q-item-section>
            <q-item-section class="q-mr-md text-right">
              {{ $t("label.quantity") }}
            </q-item-section>
          </q-item>
          <template v-for="size in selectedModel.sizes" :key="size">
            <q-item class="no-padding">
              <q-item-section v-text="size"></q-item-section>
              <q-item-section avatar>
                <q-input
                  v-model="sizes[size]"
                  type="number"
                  input-class="text-right"
                  min="0"
                  borderless
                  dense
                />
              </q-item-section>
            </q-item>
          </template>
          <q-item class="text-bold no-padding">
            <q-item-section>
              {{ $t("label.total") }}
            </q-item-section>
            <q-item-section class="q-mr-md text-right">
              {{ quantity }}
            </q-item-section>
          </q-item>
        </q-list>
      </template>

      <div class="row justify-center q-mt-md">
        <q-btn
          no-caps
          color="primary"
          icon="shopping_basket"
          :label="$t('label.order')"
          @click="orderModal = true"
          :disabled="!canOrder()"
        />
      </div>
    </q-card-section>

    <q-dialog v-model="orderModal" :persistent="loading">
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center q-pb-md">
          <div class="text-h6">
            {{ $t("label.order") }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-py-none">
          <q-input
            v-model="phone"
            mask="+7 (###) ###-##-##"
            :label="$t('label.phone')"
            ref="phoneInput"
            fill-mask
            filled
            lazy-rules
            :disable="loading"
            :rules="[(val) => isValidPhone(val) || $t('text.error.emptyPhone')]"
          />
          <q-input
            v-model="email"
            type="email"
            :label="$t('label.email')"
            ref="emailInput"
            fill-mask
            filled
            lazy-rules
            :disable="loading"
            :rules="[
              (val) => validateEmail(val) || $t('text.error.invalidEmail'),
            ]"
          />
          <span v-show="loading">
            {{ $t("text.orderBeingProcessed") }}
            {{ $t("text.canTakeSometime") }}
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            :label="$t('label.send')"
            color="primary"
            @click="createOrder"
            :disabled="loading"
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="orderCreatedModal">
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ $t("text.applicationAccepted") }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-py-lg text-center">
          <div class="q-mb-lg">
            <q-btn round color="secondary" icon="done" />
          </div>
          <span class="text-body1">
            {{ $t("text.thanksApplicationAccepted") }}
            <br />
            {{ $t("text.weWillContactYou") }}
          </span>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

import OrderService from "@/services/order";
import CanvasService from "@/services/canvas";

export default {
  name: "SelectedModel",

  data: () => ({
    orderModal: false,
    orderCreatedModal: false,
    loading: false,
    phone: "",
    email: "",
  }),

  watch: {
    sizes: {
      handler() {
        this.calculatePrice();
      },
      deep: true,
    },
  },

  computed: {
    ...mapState("app", ["user", "pricing"]),
    ...mapState("order", ["price", "sizes"]),
    ...mapState("product", ["selectedModel", "selectedModelColor"]),
    ...mapState("canvas", ["layers"]),
    ...mapGetters("order", ["quantity"]),
  },

  methods: {
    ...mapMutations("product", ["setSelectedModelColor"]),
    ...mapMutations("app", [
      "setCatalogModalOpened",
      "setAuthModalOpened",
      "setCustomProductModalOpened",
    ]),
    ...mapActions("order", ["calculatePrice"]),

    isValidPhone(value) {
      return value.match(/[0-9]/g)?.length == 11;
    },

    validateEmail(email) {
      return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);
    },

    canOrder() {
      return (
        (!this.selectedModel.clientModel && this.quantity > 0) ||
        (this.selectedModel.clientModel && this.layers.length > 0)
      );
    },

    quantityHtml() {
      let html = "";
      for (let size in this.sizes) {
        if (this.sizes[size] == 0) continue;
        html += `<b>${size.toUpperCase()}:</b> ${this.sizes[size]}<br/>`;
      }
      return html;
    },

    async makeCustomModel() {
      if (this.user) {
        this.setCustomProductModalOpened(true);
      } else {
        this.setAuthModalOpened(true);
      }
    },

    async createOrder() {
      if (!this.isValidPhone(this.phone)) {
        this.$refs.phoneInput.validate();
        return;
      }

      if (!this.validateEmail(this.email)) {
        this.$refs.emailInput.validate();
        return;
      }

      this.loading = true;

      let captures = await CanvasService.capture();

      let order = await OrderService.create({
        title: "Order №" + Date.now(),
        clientModel: this.selectedModel.clientModel,
        phone: this.phone,
        email: this.email,
        price: this.price,
        quantity: this.quantityHtml(),
        front: captures.front.id,
        back: captures.back ? captures.back.id : null,
        json: JSON.stringify({
          sizes: this.sizes,
          model: this.selectedModelColor,
          canvasData: CanvasService.toJSON(),
        }),
      });

      if (order) {
        this.orderModal = false;
        this.orderCreatedModal = true;
        this.phone = "";
        this.email = "";
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss">
.model-colors {
  position: relative;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  overflow: hidden;
  margin-right: 5px;
  margin-bottom: 5px;
  border: 1px solid #ccc;

  img {
    width: 110%;
    height: 110%;
    object-fit: none;
  }

  &.selected-model {
    i {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      font-weight: bold;
      background: #ffffff82;
    }
  }
}
</style>
