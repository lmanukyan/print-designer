<template>
  <q-dialog v-model="dialog" persistent>
    <q-card>
      <q-card-section>
        <q-spinner color="primary" size="2em" class="q-mr-md" />
        {{ $t("text.loadingAppState") }}
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "InitModal",

  computed: {
    ...mapState("product", ["models"]),

    dialog: {
      get() {
        return this.models.length === 0;
      },
      set() {},
    },
  },
};
</script>
