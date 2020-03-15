<template>
  <a-table
    :loading="loading"
    :columns="columns"
    :rowKey="item => item.handle"
    :dataSource="users"
    :pagination="false"
    bordered
  >
    <template slot="handle" slot-scope="text, record">
      <a
        :href="`https://codeforces.com/profile/${text}`"
        :style="{ fontWeight: 'bold', color: getColor(record.rating) }"
        >{{ text }}</a
      >
    </template>
    <span
      slot="color"
      slot-scope="text"
      :style="{ fontWeight: 'bold', color: getColor(text) }"
    >
      {{ text }}
    </span>
    <span slot="name" slot-scope="name">
      <router-link :to="{ name: 'profile', query: { name } }">{{
        name
      }}</router-link>
    </span>
    <template slot="operation" slot-scope="flag, record">
      <a-button
        type="primary"
        :loading="flag"
        @click="refreshUser(record.handle, record.name)"
        >刷新</a-button
      >
      <a-button
        type="danger"
        style="margin-left: 10px;"
        @click="delUser(record.handle)"
        >删除</a-button
      >
    </template>
  </a-table>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '../services/cf';
import {
  getUsers,
  updateUser,
  delUser,
  subscribe,
  unsubscribe,
  getNames
} from '../store/index';
import { getColor } from '../util';

@Component({})
export default class userTable extends Vue {
  columns = [
    {
      title: 'Handle',
      dataIndex: 'handle',
      key: 'handle',
      scopedSlots: { customRender: 'handle' }
    },
    {
      title: '姓名',
      key: 'name',
      dataIndex: 'name',
      filters: [],
      filterMultiple: true,
      onFilter: (value: string, record: User) => {
        if (record.name) {
          return record.name === value;
        }
        return false;
      },
      scopedSlots: { customRender: 'name' }
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      scopedSlots: { customRender: 'color' },
      sorter: (a: User, b: User) => {
        const fa = Reflect.has(a, 'rating'),
          fb = Reflect.has(b, 'rating');
        if (fa && fb) {
          return a.rating - b.rating;
        } else if (fa) {
          return 1;
        } else if (fb) {
          return -1;
        } else {
          return 0;
        }
      },
      sortDirections: ['descend', 'ascend']
    },
    {
      title: '历史最高 Rating',
      dataIndex: 'maxRating',
      scopedSlots: { customRender: 'color' }
    },
    {
      title: '操作',
      width: 200,
      align: 'center',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' }
    }
  ];

  loading = true;
  users: User[] = [];
  tokens: any[] = [];

  async created() {
    this.users = (await getUsers()).map(
      v => (Reflect.set(v, 'operation', false), v)
    );
    (await getNames()).forEach(name =>
      (this.columns[1].filters as any[]).push({ text: name, value: name })
    );
    this.loading = false;
    this.tokens.push(
      subscribe('addUser', (topic: string, user: any) => {
        Reflect.set(user, 'operation', false);
        this.users.push(user);
      })
    );
    this.tokens.push(
      subscribe('clear', (topic: string) => {
        this.users.splice(0, this.users.length);
      })
    );
  }
  beforeDestroy() {
    for (const token of this.tokens) {
      unsubscribe(token);
    }
  }

  findUser(handle: string) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].handle === handle) {
        return i;
      }
    }
    return undefined;
  }
  async delUser(handle: string) {
    let row = this.findUser(handle);
    if (row !== undefined) {
      await delUser(handle);
      this.users.splice(row, 1);
    }
  }
  async refreshUser(handle: string, name: string) {
    let row = this.findUser(handle);
    if (row !== undefined) {
      Reflect.set(this.users[row], 'operation', true);
      const user = await updateUser(name, handle);
      Reflect.set(user, 'operation', false);
      for (const key in this.users[row]) {
        Reflect.set(this.users[row], key, Reflect.get(user, key));
      }
    }
  }

  getColor = getColor;
}
</script>

<style></style>
