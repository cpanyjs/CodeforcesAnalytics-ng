import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import { getUserInfo, UserDTO } from '../services/cf';

Vue.use(Vuex);

interface State {
  users: Array<UserDTO & { name: string }>;
}

const state: State = {
  users: []
};

export default new Vuex.Store({
  state,
  mutations: {
    addUser(state, data: UserDTO & { name: string }) {
      state.users.push(data);
    }
  },
  actions: {
    async addUser({ commit }, { name, handle }) {
      const data = await getUserInfo(handle);
      commit('addUser', { ...data, name });
    }
  },
  modules: {},
  plugins: [
    createPersistedState({
      key: 'cf'
    })
  ]
});
