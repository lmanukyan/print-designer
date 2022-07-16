<template>

  <div class="q-pb-md q-gutter-sm">
    <q-btn 
      @click="setCatalogModalOpened(true)"
      no-caps
      color="white"
      icon="shopping_bag"
      text-color="black"
      label="каталог" 
    />
    <q-btn
      @click="makeCustomModel()"
      no-caps
      color="primary"
      icon="add"
      label="создать свой"
    />
  </div>

  <q-card class="my-card" v-if="selectedModel">
    <q-card-section>
        <div class="text-h6">{{ selectedModel.name }}</div>
    </q-card-section>

    <q-img :src="selectedModel.images[0].front.url" /> 

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
          <img :src="image.front.url">
        </div>
      </q-card-actions>
    </q-card-section>

    <template v-if="!selectedModel.clientModel">
    
      <q-card-section>
        <p class="text-subtitle1">Размер/количество</p>
          <q-list bordered separator dense>
            <template v-for="size in selectedModel.sizes" :key="size">
              <q-item>
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
            <q-item class="text-bold">
              <q-item-section>Общее</q-item-section>
              <q-item-section class="q-mr-md text-right">{{ quantity() }}</q-item-section>
            </q-item>
          </q-list>
      </q-card-section>

      <q-card-section>
        <p class="text-subtitle1">Качество</p>
        <q-select v-model="quality" :options="qualityOptions" />
      </q-card-section>

    </template>

  </q-card>

  




</template>

<script>
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'

export default {
  name: 'SelectedModel',

  data: () => ({
    qualityOptions: [
      {label: 'тонкий', value: 'thin'},
      {label: 'плотный', value: 'dense'}
    ],
    quality: {label: 'тонкий', value: 'thin'},
    sizes: {
      xs: 0, s: 0, m: 0,
      l: 0, xl: 0, xxl: 0,
    }
  }),

  computed: {
    ...mapState('app', [
      'user',
    ]),
    ...mapState('product', [
      'selectedModel',
      'selectedModelColor',
    ]),
  },

  methods: {
    ...mapMutations('product', [
      'setSelectedModelColor',
    ]),
    ...mapMutations('app', [
      'setCatalogModalOpened',
      'setAuthModalOpened',
      'setCustomProductModalOpened',
    ]),

    quantity(){
      return Object.values(this.sizes).reduce(
        (a, b) => parseInt(a) + parseInt(b), 0
      );
    },

    async makeCustomModel(){
      if(this.user){
        this.setCustomProductModalOpened(true);
      }else {
        this.setAuthModalOpened(true);
      }
    }
  },

}
</script>

<style lang="scss">
.model-colors {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  overflow: hidden;
  margin-right: 5px;
  margin-bottom: 5px;
  border: 4px solid transparent;

  img {
    width: 110%;
    height: 110%;
    object-fit: none;
  }

  &.selected-model {
    border-color: $primary;
  }
}
</style>