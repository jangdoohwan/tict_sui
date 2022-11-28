import Vue from 'vue'
import Vuex from 'vuex'
import menu from './modules/menu'
import user from './modules/user'
import dashboard from './modules/dashboard'
import envs from '@/envs'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: {
      requestCount: 0,
      isVisible: false
    },
    theme: ''
  },
  mutations: {
    PUSH_REQUEST_COUNT: (state) => {
      state.loading.requestCount++
      setTimeout(function () {
        state.loading.isVisible = state.loading.requestCount > 0
      }, envs.framework.loadingDelay)
    },
    POP_REQUEST_COUNT: (state) => {
      state.loading.requestCount--
      if (state.loading.isVisible && state.loading.requestCount < 1) {
        state.loading.isVisible = false
      }
    },
    SET_VISIBLE_LOADING: (state, visible) => {
      state.loading.isVisible = visible
    },
    SET_THEME: (state, theme) => {
      state.theme = theme
    }
  },
  actions: {
    RequestApi({ commit }) {
      commit('PUSH_REQUEST_COUNT')
    },
    ResponseApi({ commit }) {
      commit('POP_REQUEST_COUNT')
    },
    SetVisibleLoading({ commit }, visible) {
      commit('SET_VISIBLE_LOADING', visible)
    },
    SetTheme({ commit }, theme) {
      commit('SET_THEME', theme)
    }
  },
  modules: {
    menu,
    user,
    dashboard
  }
})
