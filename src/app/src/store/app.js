import { ObjectStorage } from "@/utils";

export default {
  namespaced: true,

  state() {
    return {
      user: ObjectStorage.get("appUser"),
      projects: [],
      selectedProjectId: null,
      projectsFetched: false,

      controlTab: "product",

      catalogModalOpened: false,
      authModalOpened: false,
      customProductModalOpened: false,

      uploadedImages: ObjectStorage.get("print-uploaded-images", []),
    };
  },

  mutations: {
    setUser(state, payload) {
      state.user = {
        id: payload.id,
        name: payload.name,
      };
      ObjectStorage.set("appUser", state.user);
    },
    setProjects(state, payload) {
      state.projects = payload;
    },
    pushProject(state, payload) {
      state.projects.unshift(payload);
    },
    deleteProject(state, payload) {
      state.projects = state.projects.filter(
        (project) => project.id != payload
      );
    },
    setSelectedProjectId(state, payload) {
      state.selectedProjectId = payload;
    },
    setProjectsFetched(state, payload) {
      state.projectsFetched = payload;
    },
    setControlTab(state, payload) {
      state.controlTab = payload;
    },
    setCatalogModalOpened(state, payload) {
      state.catalogModalOpened = payload;
    },
    setAuthModalOpened(state, payload) {
      state.authModalOpened = payload;
    },
    setCustomProductModalOpened(state, payload) {
      state.customProductModalOpened = payload;
    },
    pushUploadedImage(state, payload) {
      state.uploadedImages.push(payload);
      ObjectStorage.set("print-uploaded-images", state.uploadedImages);
    },
    removeUploadedImage(state, payload) {
      state.uploadedImages = state.uploadedImages.filter(
        (image) => image.id != payload
      );
      ObjectStorage.set("print-uploaded-images", state.uploadedImages);
    },
  },
};
