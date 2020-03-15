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

export async function updateUser(name: string, handle: string) {
  const user = await getUser(handle);
  user.name = name;
  await store.setItem(handle, user);
  return user;
}

export function delUser(handle: string) {
  return store.removeItem(handle);
}

export async function clear() {
  await store.clear();
  PubSub.publish('clear', {});
  return true;
}

export async function getUsers() {
  const arr: User[] = [];
  await store.iterate(value => {
    arr.push(value as User);
  });
  return arr;
}

export async function getNames() {
  const set = new Set<string>();
  await store.iterate((value: User) => {
    if (value.name) {
      set.add(value.name);
    }
  });
  const arr: string[] = [];
  set.forEach(value => arr.push(value));
  return arr;
}

export async function getNameInfo(name: string) {
  let user: User | undefined = undefined;
  await store.iterate((value: User) => {
    if (value.name === name) {
      if (!user) {
        user = new User(value);
        user.name = name;
        user.submission = value.submission;
      } else {
        user.merge(value);
      }
    }
  });
  return user;
}
