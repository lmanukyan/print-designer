import ObjectStorageService from '@/services/object-storage'

export default {

  namespaced: true,

  state () {
    return {
      user: null,
      projects: [],
      selectedProjectId: null,
      projectsFetched: false,

      controlTab: 'product',

      catalogModalOpened: false,
      authModalOpened: false,
      customProductModalOpened: false,

      uploadedImages: ObjectStorageService.get('print-uploaded-images', []),
    }
  },
  
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setProjects (state, payload) {
      state.projects = payload
    },
    pushProject (state, payload) {
      state.projects.unshift(payload)
    },
    deleteProject (state, payload) {
      state.projects = state.projects.filter(
        (project) => project.id != payload
      )
    },
    setSelectedProjectId (state, payload) {
      state.selectedProjectId = payload
    },
    setProjectsFetched (state, payload) {
      state.projectsFetched = payload
    },
    setControlTab (state, payload) {
      state.controlTab = payload;
    },
    setCatalogModalOpened (state, payload) {
      state.catalogModalOpened = payload;
    },
    setAuthModalOpened (state, payload) {
      state.authModalOpened = payload;
    },
    setCustomProductModalOpened (state, payload) {
      state.customProductModalOpened = payload;
    },
    pushUploadedImage (state, payload) {
      state.uploadedImages.push(payload);
      ObjectStorageService.set('print-uploaded-images', state.uploadedImages);
    },
  },
  
}