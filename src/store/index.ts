import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import { getUserInfo } from '../services/cf';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: [],
    member: []
  },
  mutations: {},
  actions: {
    async addUser({ commit }, { name, handle }) {
      const data = await getUserInfo(handle);
      console.log(data);
    }
  },
  modules: {},
  plugins: [
    createPersistedState({
      key: 'cf'
    })
  ]
});
