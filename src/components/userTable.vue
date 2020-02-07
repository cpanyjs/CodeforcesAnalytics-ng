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
    <template slot="operation" slot-scope="text, record, row">
      <a-button type="primary">刷新</a-button>
      <a-button
        type="danger"
        style="margin-left: 10px;"
        @click="delUser(record.handle, row)"
        >删除</a-button
      >
    </template>
  </a-table>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '../services/cf';
import { getUsers, delUser, subscribe, unsubscribe } from '../store/index';

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
      dataIndex: 'name'
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      scopedSlots: { customRender: 'color' }
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
    this.users = await getUsers();
    this.loading = false;
    this.tokens.push(
      subscribe('addUser', (topic: string, user: any) => {
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

  async delUser(handle: string, row: number) {
    await delUser(handle);
    this.users.splice(row, 1);
  }
  async refreshUser(handle: string, row: number) {}

  getColor(rating: number) {
    if (rating < 1200) return 'gray';
    if (rating < 1400) return 'green';
    if (rating < 1600) return '#03A89E';
    if (rating < 1900) return 'blue';
    if (rating < 2100) return '#a0a';
    if (rating < 2400) return '#FF8C00';
    return 'red';
  }
}
</script>

<style></style>
