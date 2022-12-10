<template>
  <q-item v-ripple>
    <q-item-section avatar top>
      <q-spinner color="primary" size="2em" />
    </q-item-section>

    <q-item-section top class="gt-sm">
      <q-item-label class="q-mt-sm"> загрузка... </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "LoadingItem",
};
</script>
