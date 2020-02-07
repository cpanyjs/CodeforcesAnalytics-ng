import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import localforage from 'localforage';
import PubSub from 'pubsub-js';

import { User, getUser } from '../services/cf';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
  plugins: []
});

const store = localforage.createInstance({
  name: 'cfany'
});

export function subscribe(topic: string, fn: Function) {
  return PubSub.subscribe(topic, fn);
}

export function unsubscribe(token: any) {
  PubSub.unsubscribe(token);
}

export async function addUser(name: string, handle: string) {
  if (await store.getItem(handle)) {
    return undefined;
  }
  const user = await getUser(handle);
  user.name = name;
  store.setItem(handle, user);
  PubSub.publish('addUser', user);
  return user;
}

export async function delUser(handle: string) {
  store.removeItem(handle);
}

export async function getUsers() {
  const arr: User[] = [];
  await store.iterate(value => {
    arr.push(value as User);
  });
  return arr;
}
