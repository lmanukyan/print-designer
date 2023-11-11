<template>
  <template v-if="user">
    <div class="q-gutter-sm">
      <q-btn no-caps icon="save" :label="$t('label.save')" @click="save" />
      <q-btn
        no-caps
        color="primary"
        icon="save_as"
        :label="$t('label.saveAs')"
        @click="openSaveModal"
      />
    </div>
    <q-list bordered separator dense class="q-mt-lg scroll-area">
      <template v-for="project in projects" :key="project.id">
        <q-item clickable v-ripple @click="launchProjects(project.id)">
          <q-item-section>{{ project.title }}</q-item-section>
          <q-item-section avatar>
            <div>
              <q-btn
                size="12px"
                flat
                dense
                round
                color="negative"
                icon="delete"
                @click.stop="confirmDelete(project.id)"
              />
              <q-btn
                v-if="selectedProjectId == project.id"
                size="12px"
                flat
                dense
                round
                icon="logout"
                @click.stop="exitProject"
              />
              <q-btn
                v-else
                class="text-grey-7"
                size="12px"
                flat
                dense
                round
                icon="play_arrow"
              />
            </div>
          </q-item-section>
        </q-item>
      </template>
      <q-item v-show="!projects.length">
        <q-item-section>
          {{ $t("text.notSavedProjects") }}
        </q-item-section>
      </q-item>
      <q-separator v-show="projects.length" />
    </q-list>

    <q-dialog v-model="confirmModal" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">
            {{ $t("text.confirmDelete") }}
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('label.no')" color="primary" v-close-popup />
          <q-btn
            flat
            :label="$t('label.yes')"
            color="primary"
            v-close-popup
            @click="deleteProjectAsync"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="newProjectModal" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">
            {{ $t("text.projectName") }}
          </span>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense v-model="title" autofocus @keyup.enter="saveAs" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('label.cancel')"
            color="primary"
            v-close-popup
          />
          <q-btn
            flat
            :label="$t('label.save')"
            color="primary"
            v-close-popup
            @click="saveAs"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>

  <template v-else>
    <p>
      {{ $t("text.loginForProjects") }}
      <span
        @click="setAuthModalOpened(true)"
        class="text-primary cursor-pointer"
      >
        {{ $t("label.login") }}
      </span>
    </p>
  </template>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";

import ProjectService from "@/services/project";
import CanvasService from "@/services/canvas";

export default {
  name: "ProjectsTab",

  data: () => ({
    deletableId: null,
    confirmModal: false,
    newProjectModal: false,

    title: "",
  }),

  watch: {
    user(newUser) {
      if (newUser) this.loadProjects();
    },
  },

  computed: {
    ...mapState("canvas", ["mode"]),
    ...mapState("app", [
      "user",
      "projects",
      "projectsFetched",
      "selectedProjectId",
    ]),
    ...mapState("product", ["selectedModel", "selectedModelColor"]),
  },

  methods: {
    ...mapMutations("canvas", ["setMode"]),
    ...mapMutations("app", [
      "setProjects",
      "pushProject",
      "deleteProject",
      "setSelectedProjectId",
      "setProjectsFetched",
      "setAuthModalOpened",
    ]),
    ...mapMutations("product", [
      "selectFristModel",
      "setSelectedModel",
      "setSelectedModelColor",
    ]),

    openSaveModal() {
      this.newProjectModal = true;
    },

    async save() {
      if (!this.selectedProjectId) {
        return this.openSaveModal();
      }
      await ProjectService.update(this.selectedProjectId, {
        json: this.getProjectData(),
      });
    },
    async saveAs() {
      if (!this.title) {
        return;
      }

      let project = await ProjectService.create({
        title: this.title,
        json: this.getProjectData(),
      });

      if (project.id) {
        this.setSelectedProjectId(project.id);
        delete project.json;
        this.pushProject(project);
      }

      this.newProjectModal = false;
      this.title = "";
    },

    getProjectData() {
      return JSON.stringify({
        mode: this.mode,
        selectedModel: this.selectedModel,
        selectedModelColor: this.selectedModelColor,
        canvasData: CanvasService.toJSON(),
      });
    },

    async loadProjects() {
      let projects = await ProjectService.getProjects();
      if (projects) {
        this.setProjects(projects);
        this.setProjectsFetched(true);
      }
    },

    async launchProjects(id) {
      let project = await ProjectService.getProject(id);
      if (project) {
        let data = JSON.parse(project.json);
        CanvasService.loadFromJSON(data.canvasData, () => {
          this.setSelectedModel(data.selectedModel);
          this.setSelectedModelColor(data.selectedModelColor);
          this.setSelectedProjectId(id);
          this.setMode(data.mode);
        });
      }
    },

    exitProject() {
      this.setSelectedProjectId(null);
      this.selectFristModel();
      CanvasService.deleteAllLayers();
    },

    async confirmDelete(id) {
      this.confirmModal = true;
      this.deletableId = id;
    },

    async deleteProjectAsync() {
      let result = await ProjectService.delete(this.deletableId);
      if (result) {
        this.deleteProject(this.deletableId);

        if (this.selectedProjectId == this.deletableId) {
          this.exitProject();
        }
      }
    },
  },

  mounted() {
    if (this.user && !this.projectsFetched) {
      this.loadProjects();
    }
  },
};
</script>
