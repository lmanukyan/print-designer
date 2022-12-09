<template>
  <q-tabs
    v-model="tab"
    inline-label
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
  >
    <q-tab name="product" icon="crop_original" label="Продукт" />
    <q-tab name="object" icon="tune" label="Объект" />
  </q-tabs>

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="product" class="q-px-none">
      <SelectedModel />
    </q-tab-panel>
    <q-tab-panel name="object" class="q-px-none">
      <ObjectDetails />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";

import SelectedModel from "@/components/Controls/SelectedModel";
import ObjectDetails from "@/components/Controls/Details";

export default {
  name: "ControlsPanel",

  components: {
    SelectedModel,
    ObjectDetails,
  },

  computed: {
    ...mapState("app", ["controlTab"]),
    tab: {
      get() {
        return this.controlTab;
      },
      set(value) {
        this.setControlTab(value);
      },
    },
  },

  methods: {
    ...mapMutations("app", ["setControlTab"]),
  },
};
</script>
