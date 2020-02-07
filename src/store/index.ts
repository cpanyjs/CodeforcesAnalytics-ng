import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import { User, getUser } from '../services/cf';

Vue.use(Vuex);

interface State {
  users: Array<User>;
}

const state: State = {
  users: []
};

export default new Vuex.Store({
  state,
  mutations: {
    addUser(state, data: User) {
      state.users.push(data);
    },
    delUser(state, { handle }) {
      let id = undefined;
      for (let i = 0; i < state.users.length; i++) {
        if (state.users[i].handle === handle) {
          id = i;
          break;
        }
      }
      if (id !== undefined) {
        state.users.splice(id, 1);
      }
    }
  },
  actions: {
    async addUser({ state, commit }, { name, handle }) {
      if (state.users.filter(item => item.handle === handle).length > 0) {
        return;
      }
      const user = await getUser(handle);
      user.name = name;
      commit('addUser', user);
    }
  },
  modules: {},
  plugins: [
    createPersistedState({
      key: 'cf'
    })
  ]
});
