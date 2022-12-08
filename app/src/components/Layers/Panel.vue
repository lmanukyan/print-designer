<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
  >
    <q-tab name="layers" label="Слои" />
    <q-tab name="images" label="Файлы" />
    <q-tab name="project" label="Проект" />
  </q-tabs>

  <q-scroll-area style="height: 650px;" :thumbStyle="{ width: '5px' }">

    <q-tab-panels
      v-model="tab"
      animated
    >
      <q-tab-panel name="layers">
        <LayersList />
      </q-tab-panel>

      <q-tab-panel name="images">
      <q-list bordered separator>
        <template v-for="image in uploadedImages" :key="image.id">
          <q-item
            @click="addToLayers(image.url)"
            clickable 
            v-ripple 
          >
            <q-item-section avatar>
              <q-img
                :src="image.url"
                style="height: 34px; max-width: 34px"
              />
            </q-item-section>
            
            <q-item-section top class="gt-sm">
              <q-item-label class="q-mt-sm"> изображение </q-item-label>
            </q-item-section>

            <q-item-section avatar side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn class="gt-xs text-red" size="12px" flat dense round icon="delete" @click.stop="removeUploadedImage(image.id)" />
                <q-btn class="gt-xs" size="12px" flat dense round icon="add" />
              </div>
            </q-item-section>

            
          </q-item>
        </template>
      </q-list>
      </q-tab-panel>


      <q-tab-panel name="project">
        <ProjectsTab />
      </q-tab-panel>

    </q-tab-panels>
  </q-scroll-area>

</template>

<script>
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'

import CanvasService from '@/services/canvas'

import LayersList from '@/components/Layers/List'
import ProjectsTab from '@/components/Projects'

export default {
  name: 'LayersPanel',

  components: {
    LayersList,
    ProjectsTab
  },

  data: () => ({
    tab: 'layers',
  }),

  computed: {
    ...mapState('app', [
      'uploadedImages',
    ]),
  },

  methods: {
    ...mapMutations('app', ['removeUploadedImage']),
    
    addToLayers(url){
      CanvasService.addImageLayer(url)
      this.tab = 'layers'
    }
  }

}
</script>