<template>
  <div class="q-pb-md q-px-2">
    <q-btn
      @click="setCatalogModalOpened(true)"
      no-caps
      color="white"
      icon="shopping_bag"
      text-color="black"
      label="каталог"
      class="q-mr-sm"
    />
    <q-btn
      @click="makeCustomModel()"
      no-caps
      color="primary"
      icon="add"
      label="создать свой"
    />
  </div>

  <q-card class="q-mx-2" v-if="selectedModel">
    <q-card-section>
      <div class="text-h6">{{ selectedModel.title }}</div>
    </q-card-section>

    <q-card-section>
      <p class="text-subtitle1">Цвет</p>
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
          <q-item-label>Цена</q-item-label>
        </q-item-section>
        <q-item-section side>
          <span class="text-bold">{{ price }} ₽</span>
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Срочно</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-checkbox v-model="urgency" />
        </q-item-section>
      </q-item>

      <template v-if="!selectedModel.clientModel">
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Качество</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-select v-model="quality" :options="qualityOptions" dense />
          </q-item-section>
        </q-item>

        <q-list separator dense class="q-pa-md">
          <q-item class="text-bold no-padding">
            <q-item-section>Размер</q-item-section>
            <q-item-section class="q-mr-md text-right"
              >Kоличество</q-item-section
            >
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
            <q-item-section>Общее</q-item-section>
            <q-item-section class="q-mr-md text-right">{{
              quantity
            }}</q-item-section>
          </q-item>
        </q-list>
      </template>

      <div class="row justify-center q-mt-md">
        <q-btn
          no-caps
          color="primary"
          icon="shopping_basket"
          label="Заказать"
          @click="orderModal = true"
          :disabled="!canOrder()"
        />
      </div>
    </q-card-section>

    <q-dialog v-model="orderModal" :persistent="loading">
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center q-pb-md">
          <div class="text-h6">Номер телефона</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            v-model="phone"
            mask="+7 (###) ###-##-##"
            ref="phoneInput"
            fill-mask
            filled
            lazy-rules
            :rules="[(val) => isValidPhone(val) || 'заполните номер телефона']"
          />
          <span v-show="loading">Пожалуйста подождите, ваш заказ обрабатывается. Это может занять некоторое время.</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Отправить"
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
          <div class="text-h6">Заявка принята</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-py-lg text-center">
          <div class="q-mb-lg">
            <q-btn round color="secondary" icon="done" />
          </div>
          <span class="text-body1">Спасибо, ваша заявка принята! <br/> Мы свяжемся с вами в ближайшее время.</span>
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
import { ComputedMutator } from "@/utils";

import OrderService from "@/services/order";
import CanvasService from "@/services/canvas";

export default {
  name: "SelectedModel",

  data: () => ({
    qualityOptions: [
      { label: "тонкий", value: "thin" },
      { label: "плотный", value: "dense" },
    ],
    orderModal: false,
    orderCreatedModal: false,
    loading: false,
    phone: "",
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

    urgency: ComputedMutator("order", "urgency", "setUrgency"),
    quality: ComputedMutator("order", "quality", "setQuality"),
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

      this.loading = true;

      let captures = await CanvasService.capture();

      let order = await OrderService.create({
        title: "Order №" + Date.now(),
        clientModel: this.selectedModel.clientModel,
        phone: this.phone,
        price: this.price,
        urgency: this.urgency,
        quality: this.quality.label,
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
